import { passwordOk, readJsonBody } from "../lib/auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { password } = readJsonBody(req);
  if (passwordOk(password)) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Incorrect password" });
  }
}
