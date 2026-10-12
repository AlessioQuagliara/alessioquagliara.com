/**
 * Snippet "digitati" sullo schermo del MacBook nello scrollytelling.
 * Codice vero e funzionante: `app.py` è un'API FastAPI che accetta le letture
 * (validazione + API key); `webhook.ts` è un endpoint di automazione che
 * verifica la firma HMAC e mette ogni evento nella coda del suo tenant.
 * Max ~25 righe, righe corte per lo schermo.
 */

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "accent";

export type Token = { text: string; kind: TokenKind };

export type CodeSnippet = {
  file: string;
  code: string;
  tokens: Token[];
};

const APP_PY = `import os
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="ingest-api")
API_KEY = os.environ.get("API_KEY", "")

class Reading(BaseModel):
    device: str = Field(min_length=1)
    value: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/readings", status_code=202)
def ingest(r: Reading, x_api_key: str = Header()):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(status_code=401)
    # queued, then processed by the pipeline
    return {"accepted": r.device}`;

const WEBHOOK_TS = `import { createHmac, timingSafeEqual } from "node:crypto";

type Event = { tenant: string; type: string; data: unknown };
const SECRET = process.env.WEBHOOK_SECRET ?? "";
const queues = new Map<string, Event[]>();

function verify(body: string, signature: string) {
  const hash = createHmac("sha256", SECRET).update(body);
  const a = Buffer.from(hash.digest("hex"));
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("x-signature") ?? "";
  if (!SECRET || !verify(body, sig)) {
    return new Response("bad signature", { status: 401 });
  }
  const event = JSON.parse(body) as Event;
  // one queue per tenant: no data leaks between clients
  const queue = queues.get(event.tenant) ?? [];
  queues.set(event.tenant, [...queue, event]);
  return Response.json({ queued: event.type }, { status: 202 });
}`;

type Rule = { kind: TokenKind; pattern: string };

const PYTHON_RULES: Rule[] = [
  { kind: "comment", pattern: "#[^\\n]*" },
  { kind: "string", pattern: "\"[^\"\\n]*\"|'[^'\\n]*'" },
  { kind: "accent", pattern: "@[\\w.]+|\\b\\d+(?:\\.\\d+)?\\b" },
  {
    kind: "keyword",
    pattern: "\\b(?:from|import|def|class|return|raise|if|else|for|in|not|and|or|None|True|False)\\b",
  },
];

const TS_RULES: Rule[] = [
  { kind: "comment", pattern: "\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*" },
  { kind: "string", pattern: "\"[^\"\\n]*\"|'[^'\\n]*'" },
  { kind: "accent", pattern: "\\b\\d+(?:\\.\\d+)?\\b|\\b[A-Z]\\w*\\b" },
  {
    kind: "keyword",
    pattern:
      "\\b(?:import|from|export|async|await|function|return|const|let|type|if|new|as)\\b",
  },
];

/** Highlighter minimale fatto a mano: una regex con un gruppo per tipo di token. */
function tokenize(code: string, rules: Rule[]): Token[] {
  const matcher = new RegExp(rules.map((rule) => `(${rule.pattern})`).join("|"), "g");
  const tokens: Token[] = [];
  let cursor = 0;

  for (const match of code.matchAll(matcher)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      tokens.push({ text: code.slice(cursor, start), kind: "plain" });
    }
    const groupIndex = match.slice(1).findIndex((group) => group !== undefined);
    tokens.push({ text: match[0], kind: rules[groupIndex]?.kind ?? "plain" });
    cursor = start + match[0].length;
  }

  if (cursor < code.length) {
    tokens.push({ text: code.slice(cursor), kind: "plain" });
  }

  return tokens;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  { file: "app.py", code: APP_PY, tokens: tokenize(APP_PY, PYTHON_RULES) },
  { file: "webhook.ts", code: WEBHOOK_TS, tokens: tokenize(WEBHOOK_TS, TS_RULES) },
];

/** Righe e colonne massime: servono a scalare il font sulla larghezza dello schermo. */
export const CODE_MAX_LINES = Math.max(
  ...CODE_SNIPPETS.map((snippet) => snippet.code.split("\n").length)
);
export const CODE_MAX_COLUMNS = Math.max(
  ...CODE_SNIPPETS.flatMap((snippet) => snippet.code.split("\n").map((line) => line.length))
);
