import { requireAuth, readJsonBody } from "../lib/auth.js";
import { upsertItem, saveConfig } from "../lib/store.js";

export default requireAuth(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const body = readJsonBody(req);
    if (body.kind === "config") {
      if (!body.config || typeof body.config !== "object") {
        res.status(400).json({ error: "Missing config" });
        return;
      }
      await saveConfig(body.config);
      res.status(200).json({ ok: true });
      return;
    }
    await upsertItem(body.kind, body.item);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});
