import crypto from "crypto";

// Constant-time comparison of the shared team password.
export function passwordOk(provided) {
  const expected = process.env.APP_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(String(provided || ""));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Wrap a handler so it only runs when the correct password header is present.
export function requireAuth(handler) {
  return async (req, res) => {
    const provided = req.headers["x-qa-pass"];
    if (!passwordOk(provided)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    return handler(req, res);
  };
}

export function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body || "{}");
  } catch {
    return {};
  }
}
