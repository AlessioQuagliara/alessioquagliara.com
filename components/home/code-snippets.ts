/**
 * Snippet "digitati" sullo schermo del MacBook nello scrollytelling.
 * Codice vero e funzionante: `python app.py` (con Flask installato) e
 * `cc sensor.c && ./a.out`. Max ~20 righe, righe corte per lo schermo.
 */

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "accent";

export type Token = { text: string; kind: TokenKind };

export type CodeSnippet = {
  file: string;
  code: string;
  tokens: Token[];
};

const APP_PY = `from random import uniform
from flask import Flask, jsonify

app = Flask(__name__)

def read_sensor():
    # stand-in for the ESP32 reading
    return round(uniform(20.0, 25.0), 2)

@app.route("/")
def index():
    return jsonify(status="ok")

@app.route("/api/sensor")
def sensor():
    return jsonify(temperature=read_sensor())

if __name__ == "__main__":
    app.run(debug=True)`;

const SENSOR_C = `#include <stdio.h>

#define WINDOW 5

int main(void) {
  /* raw readings from the sensor */
  int raw[] = {512, 530, 498, 801, 505, 515, 520, 509};
  int n = sizeof raw / sizeof raw[0];
  int sum = 0;

  for (int i = 0; i < n; i++) {
    sum += raw[i];
    if (i >= WINDOW) sum -= raw[i - WINDOW];
    int count = i < WINDOW ? i + 1 : WINDOW;
    printf("raw=%d avg=%.1f\\n", raw[i], (double)sum / count);
  }
  return 0;
}`;

type Rule = { kind: TokenKind; pattern: string };

const PYTHON_RULES: Rule[] = [
  { kind: "comment", pattern: "#[^\\n]*" },
  { kind: "string", pattern: "\"[^\"\\n]*\"|'[^'\\n]*'" },
  { kind: "accent", pattern: "@[\\w.]+|\\b\\d+(?:\\.\\d+)?\\b" },
  {
    kind: "keyword",
    pattern: "\\b(?:from|import|def|return|if|else|for|in|not|and|or|None|True|False)\\b",
  },
];

const C_RULES: Rule[] = [
  { kind: "comment", pattern: "\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*" },
  { kind: "string", pattern: "\"(?:\\\\.|[^\"\\\\\\n])*\"|<\\w+\\.h>" },
  { kind: "accent", pattern: "#\\w+|\\b\\d+(?:\\.\\d+)?\\b" },
  {
    kind: "keyword",
    pattern: "\\b(?:int|double|float|char|void|for|while|if|else|return|sizeof|const)\\b",
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
