/**
 * Snippet "digitati" sullo schermo del MacBook nello scrollytelling.
 * Codice vero e funzionante: `app.py` è un'API Flask che accetta le letture
 * dell'ESP32 (API key + validazione); `cc sensor.c && ./a.out` pulisce il
 * segnale con una media mobile su buffer circolare.
 * Max ~24 righe, righe corte per lo schermo.
 */

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "accent";

export type Token = { text: string; kind: TokenKind };

export type CodeSnippet = {
  file: string;
  code: string;
  tokens: Token[];
};

const APP_PY = `import os
from flask import Flask, abort, jsonify, request

app = Flask(__name__)
API_KEY = os.environ.get("API_KEY", "")
readings = []  # last values sent by the ESP32

@app.get("/health")
def health():
    return jsonify(status="ok")

@app.post("/api/readings")
def ingest():
    key = request.headers.get("X-API-Key")
    if not API_KEY or key != API_KEY:
        abort(401)
    data = request.get_json(silent=True) or {}
    if not isinstance(data.get("value"), (int, float)):
        abort(422)
    readings.append(float(data["value"]))
    del readings[:-50]  # keep the last 50
    return jsonify(accepted=len(readings)), 202`;

const SENSOR_C = `#include <stdio.h>

#define WINDOW 5

/* circular buffer: the oldest reading gets overwritten */
static int buf[WINDOW];
static int head = 0, count = 0;
static long sum = 0;

double smooth(int raw) {
  if (count == WINDOW) sum -= buf[head];
  else count++;
  buf[head] = raw;
  sum += raw;
  head = (head + 1) % WINDOW;
  return (double)sum / count;
}

int main(void) {
  int raw[] = {512, 530, 498, 801, 505, 515, 520};
  for (int i = 0; i < 7; i++)
    printf("raw=%d avg=%.1f\\n", raw[i], smooth(raw[i]));
  return 0;
}`;

type Rule = { kind: TokenKind; pattern: string };

const PYTHON_RULES: Rule[] = [
  { kind: "comment", pattern: "#[^\\n]*" },
  { kind: "string", pattern: "\"[^\"\\n]*\"|'[^'\\n]*'" },
  { kind: "accent", pattern: "@[\\w.]+|\\b\\d+(?:\\.\\d+)?\\b" },
  {
    kind: "keyword",
    pattern: "\\b(?:from|import|def|return|if|else|for|in|not|and|or|del|None|True|False)\\b",
  },
];

const C_RULES: Rule[] = [
  { kind: "comment", pattern: "\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*" },
  { kind: "string", pattern: "\"(?:\\\\.|[^\"\\\\\\n])*\"|<\\w+\\.h>" },
  { kind: "accent", pattern: "#\\w+|\\b\\d+(?:\\.\\d+)?\\b" },
  {
    kind: "keyword",
    pattern: "\\b(?:int|long|double|float|char|void|static|for|while|if|else|return|sizeof|const)\\b",
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
  { file: "sensor.c", code: SENSOR_C, tokens: tokenize(SENSOR_C, C_RULES) },
];

/** Righe e colonne massime: servono a scalare il font sulla larghezza dello schermo. */
export const CODE_MAX_LINES = Math.max(
  ...CODE_SNIPPETS.map((snippet) => snippet.code.split("\n").length)
);
export const CODE_MAX_COLUMNS = Math.max(
  ...CODE_SNIPPETS.flatMap((snippet) => snippet.code.split("\n").map((line) => line.length))
);
