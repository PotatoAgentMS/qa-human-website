import { Redis } from "@upstash/redis";

// Works with both the Vercel KV integration (KV_REST_API_*) and the
// Upstash Marketplace integration (UPSTASH_REDIS_REST_*).
function makeRedis() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Missing database credentials. Connect an Upstash Redis store in Vercel (Storage tab)."
    );
  }
  return new Redis({ url, token });
}

let _redis = null;
export function redis() {
  if (!_redis) _redis = makeRedis();
  return _redis;
}

export const KEYS = {
  entries: "aihqt:entries",
  patterns: "aihqt:patterns",
  fixes: "aihqt:fixes",
  config: "aihqt:config",
};

export const COLLECTIONS = ["entries", "patterns", "fixes"];

export const DEFAULT_CONFIG = {
  categories: [
    { name: "Conversation Flow", description: "The agent sounds scripted, resets the conversation, repeats itself, or does not move naturally through the call." },
    { name: "Listening and Comprehension", description: "The agent misses clear caller input, asks for information already given, misunderstands the caller, or does not respond logically." },
    { name: "Name Capture Issues", description: "The agent fails to pick up the caller's name correctly, mishears the name, stores the wrong name, or keeps asking for the name even after it was provided." },
    { name: "Tone and Empathy", description: "The agent sounds too cold, too cheerful, too formal, dismissive, awkward, or emotionally mismatched to the caller." },
    { name: "Hallucination or Assumption", description: "The agent invents information, assumes missing values, adds details the caller did not provide, or answers without enough confirmation." },
    { name: "Variable and Data Capture", description: "The agent stores wrong values, fails to update values, captures invalid information, or continues with missing required data." },
    { name: "API and Tool Handling", description: "The agent treats failed, incomplete, or null API responses as successful instead of verifying or escalating." },
    { name: "Transfer and Escalation", description: "The agent transfers too early, refuses to transfer when needed, or gives an unnatural transfer message." },
    { name: "Timing and Interruptions", description: "The agent cuts off the caller, talks over them, responds too slowly, or leaves awkward pauses." },
    { name: "Policy or Workflow Issues", description: "The agent does not follow business rules, office rules, scheduling restrictions, eligibility rules, or the intended workflow." },
  ],
  severities: ["Critical", "Major", "Minor"],
  statuses: ["Open", "In Progress", "Monitoring", "Resolved", "Closed"],
  owners: ["Unassigned"],
  environments: ["CANARY", "ENTERPRISE", "PROD"],
  frequencies: ["One-off", "Occasional", "Frequent", "Every call"],
};

// @upstash/redis auto-serializes JSON, so hgetall returns parsed objects.
export async function readAll() {
  const r = redis();
  const [entries, patterns, fixes, config] = await Promise.all([
    r.hgetall(KEYS.entries),
    r.hgetall(KEYS.patterns),
    r.hgetall(KEYS.fixes),
    r.get(KEYS.config),
  ]);
  return {
    entries: Object.values(entries || {}),
    patterns: Object.values(patterns || {}),
    fixes: Object.values(fixes || {}),
    config: config || DEFAULT_CONFIG,
  };
}

export async function upsertItem(kind, item) {
  if (!COLLECTIONS.includes(kind)) throw new Error("Invalid kind: " + kind);
  if (!item || !item.id) throw new Error("Item must have an id.");
  await redis().hset(KEYS[kind], { [item.id]: item });
}

export async function deleteItem(kind, id) {
  if (!COLLECTIONS.includes(kind)) throw new Error("Invalid kind: " + kind);
  await redis().hdel(KEYS[kind], id);
}

export async function saveConfig(config) {
  await redis().set(KEYS.config, config);
}
