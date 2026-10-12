/**
 * Snippet "digitati" sullo schermo del MacBook nello scrollytelling.
 * Codice vero e funzionante (Flask): `webhook.py` verifica la firma dei webhook
 * Stripe e manda il cliente al CRM; `api.py` è un endpoint multi-tenant che
 * valida i dati con Pydantic e non mescola i clienti.
 * Max ~27 righe, righe corte per lo schermo.
 */

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "accent";

export type Token = { text: string; kind: TokenKind };

export type CodeSnippet = {
  file: string;
  code: string;
  tokens: Token[];
};

const WEBHOOK_PY = `import os
import requests
import stripe
from flask import Flask, abort, request

app = Flask(__name__)
SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]
CRM_URL = os.environ["CRM_URL"]  # HubSpot, Pipedrive, ...

@app.post("/webhooks/stripe")
def stripe_webhook():
    try:
        event = stripe.Webhook.construct_event(
            request.get_data(),
            request.headers.get("Stripe-Signature", ""),
            SECRET,
        )
    except (ValueError, stripe.SignatureVerificationError):
        abort(400)  # fake or broken: not our problem

    if event["type"] == "checkout.session.completed":
        who = event["data"]["object"]["customer_details"]
        requests.post(CRM_URL, timeout=5, json={
            "email": who["email"], "name": who["name"],
        }).raise_for_status()  # CRM down? Stripe retries
    return "", 204`;

const API_PY = `from flask import Flask, abort, g, jsonify, request
from pydantic import BaseModel, Field, ValidationError

app = Flask(__name__)
TENANTS = {"key-acme": "acme", "key-studio": "studio"}
leads = {}  # one list per tenant, never mixed

class Lead(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(pattern=r"^[^@\\s]+@[^@\\s]+\\.\\w+$")
    budget: int | None = Field(None, ge=0)

@app.before_request
def resolve_tenant():
    key = request.headers.get("X-API-Key")
    g.tenant = TENANTS.get(key)
    if g.tenant is None:
        abort(401)

@app.post("/api/leads")
def create_lead():
    try:
        data = request.get_json(force=True)
        lead = Lead.model_validate(data)
    except ValidationError as err:
        return {"errors": err.errors()}, 422
    leads.setdefault(g.tenant, []).append(lead)
    return jsonify(lead.model_dump()), 201`;

type Rule = { kind: TokenKind; pattern: string };

const PYTHON_RULES: Rule[] = [
  { kind: "comment", pattern: "#[^\\n]*" },
  { kind: "string", pattern: "\"[^\"\\n]*\"|'[^'\\n]*'" },
  { kind: "accent", pattern: "@[\\w.]+|\\b\\d+(?:\\.\\d+)?\\b" },
  {
    kind: "keyword",
    pattern: "\\b(?:from|import|def|class|return|if|else|for|in|is|not|and|or|try|except|as|None|True|False)\\b",
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
  { file: "webhook.py", code: WEBHOOK_PY, tokens: tokenize(WEBHOOK_PY, PYTHON_RULES) },
  { file: "api.py", code: API_PY, tokens: tokenize(API_PY, PYTHON_RULES) },
];

/** Righe e colonne massime: servono a scalare il font sulla larghezza dello schermo. */
export const CODE_MAX_LINES = Math.max(
  ...CODE_SNIPPETS.map((snippet) => snippet.code.split("\n").length)
);
export const CODE_MAX_COLUMNS = Math.max(
  ...CODE_SNIPPETS.flatMap((snippet) => snippet.code.split("\n").map((line) => line.length))
);
