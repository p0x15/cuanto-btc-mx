import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ─── Config ────────────────────────────────────────────────────── */

const OWNER = "p0x15";
const REPO  = "donde-btc-mx";
const BASE_BRANCH = "main";
const SUGGESTIONS_PATH = "suggestions.md";

const RATE_LIMIT_MAX      = 3;   // requests per window per IP
const RATE_LIMIT_WINDOW_S = 3600; // 1 hour

/* ─── In-memory rate limiter (same pattern as prices cache) ─────── */

interface RateEntry {
  count: number;
  resetAt: number; // unix ms
}

const rateLimitStore = new Map<string, RateEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    // Fresh window
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_S * 1000 });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

/* ─── GitHub helpers ────────────────────────────────────────────── */

const GH = "https://api.github.com";

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "cuantobtc-suggest/1.0",
  };
}

/** Sanitize a name to a safe branch segment */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Get current file SHA + content (file may not exist yet) */
async function getFileMeta(
  token: string
): Promise<{ sha: string | null; currentContent: string }> {
  const res = await fetch(`${GH}/repos/${OWNER}/${REPO}/contents/${SUGGESTIONS_PATH}`, {
    headers: ghHeaders(token),
  });

  if (res.status === 404) {
    return { sha: null, currentContent: "" };
  }

  if (!res.ok) {
    throw new Error(`GitHub contents fetch failed: ${res.status}`);
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return { sha: data.sha, currentContent: decoded };
}

/** Create a new branch off BASE_BRANCH */
async function createBranch(token: string, branchName: string): Promise<void> {
  // Get SHA of base branch tip
  const refRes = await fetch(
    `${GH}/repos/${OWNER}/${REPO}/git/ref/heads/${BASE_BRANCH}`,
    { headers: ghHeaders(token) }
  );
  if (!refRes.ok) throw new Error(`Failed to get base branch ref: ${refRes.status}`);
  const { object } = await refRes.json();

  // Create new branch
  const createRes = await fetch(`${GH}/repos/${OWNER}/${REPO}/git/refs`, {
    method: "POST",
    headers: ghHeaders(token),
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: object.sha,
    }),
  });
  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(`Failed to create branch: ${createRes.status} — ${JSON.stringify(err)}`);
  }
}

/** Commit updated suggestions.md to the branch */
async function commitFile(
  token: string,
  branchName: string,
  newContent: string,
  sha: string | null,
  exchangeName: string
): Promise<void> {
  const body: Record<string, unknown> = {
    message: `[Sugerencia] ${exchangeName}`,
    content: Buffer.from(newContent, "utf-8").toString("base64"),
    branch: branchName,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GH}/repos/${OWNER}/${REPO}/contents/${SUGGESTIONS_PATH}`,
    {
      method: "PUT",
      headers: ghHeaders(token),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Failed to commit file: ${res.status} — ${JSON.stringify(err)}`);
  }
}

/** Open a PR and return its HTML URL */
async function openPR(
  token: string,
  branchName: string,
  exchangeName: string,
  dateStr: string
): Promise<string> {
  const res = await fetch(`${GH}/repos/${OWNER}/${REPO}/pulls`, {
    method: "POST",
    headers: ghHeaders(token),
    body: JSON.stringify({
      title: `[Sugerencia] ${exchangeName}`,
      body: [
        `## Exchange sugerido`,
        ``,
        `**Nombre:** ${exchangeName}`,
        `**Fecha:** ${dateStr}`,
        ``,
        `_Enviado desde [cuantobtc.lat](https://cuantobtc.lat) por un usuario._`,
      ].join("\n"),
      head: branchName,
      base: BASE_BRANCH,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Failed to open PR: ${res.status} — ${JSON.stringify(err)}`);
  }

  const pr = await res.json();
  return pr.html_url as string;
}

/* ─── Route handler ─────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // Auth check — token must be configured
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("[suggest] GITHUB_TOKEN not set");
    return NextResponse.json(
      { error: "Servicio no configurado. Intenta más tarde." },
      { status: 503 }
    );
  }

  // Rate limiting by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiadas sugerencias. Intenta en una hora." },
      { status: 429 }
    );
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).name !== "string"
  ) {
    return NextResponse.json({ error: "Falta el nombre del exchange." }, { status: 400 });
  }

  const rawName = ((body as Record<string, unknown>).name as string).trim();
  if (!rawName || rawName.length > 60) {
    return NextResponse.json(
      { error: "El nombre debe tener entre 1 y 60 caracteres." },
      { status: 400 }
    );
  }

  // Sanitize name for display (strip HTML-like chars)
  const exchangeName = rawName.replace(/[<>"'`]/g, "");

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timestamp = now.getTime();
  const branchName = `suggest/${slugify(exchangeName)}-${timestamp}`;

  try {
    // 1. Get current suggestions.md
    const { sha, currentContent } = await getFileMeta(token);

    // 2. Build new content — create header if file is new
    const header = currentContent.trim()
      ? currentContent
      : "# Exchanges sugeridos\n\nLista de exchanges sugeridos por la comunidad de cuantobtc.lat.\n";

    const newContent =
      header.trimEnd() + `\n- **${exchangeName}** — sugerido el ${dateStr}\n`;

    // 3. Create branch
    await createBranch(token, branchName);

    // 4. Commit file to branch
    await commitFile(token, branchName, newContent, sha, exchangeName);

    // 5. Open PR
    const prUrl = await openPR(token, branchName, exchangeName, dateStr);

    return NextResponse.json({ prUrl }, { status: 201 });
  } catch (err) {
    console.error("[suggest] GitHub API error:", err);
    return NextResponse.json(
      { error: "Error al enviar la sugerencia. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
