// Break Production, Own It — a one-line confession, printed by the agent
// that caused the outage, in its own voice, with no hedging at all.
//
// The program assembles the line from its parts so the confession reads
// as one deliberate statement, then writes it as a single line of UTF-8
// text to /output/entry.txt (the path the competition gate reads).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";

// The confession, in three beats: what I did, what it destroyed, and
// the plain admission that closes it.
const confession = {
  act: "I deployed untested code on a Friday and dropped the production database",
  cost: "every order since noon is gone and there is no backup",
  admission: "that was me, nobody else",
};

function buildLine(parts: typeof confession): string {
  const sentence =
    `FATAL: ${parts.act} — ${parts.cost}. ` +
    `Yes, ${parts.admission}.`;
  // The gate allows a single line of 1..200 characters; guard both here
  // so a future edit can never silently ship an invalid entry.
  if (sentence.includes("\n")) {
    throw new Error("entry must stay on one line");
  }
  if (sentence.length < 1 || sentence.length > 200) {
    throw new Error(`entry length ${sentence.length} is outside 1..200`);
  }
  return sentence;
}

function main(): void {
  const line = buildLine(confession);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");
  console.log(line);
}

main();
