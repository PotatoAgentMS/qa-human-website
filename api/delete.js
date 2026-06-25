import { requireAuth, readJsonBody } from "../lib/auth.js";
import { deleteItem } from "../lib/store.js";

export default requireAuth(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { kind, id } = readJsonBody(req);
    await deleteItem(kind, id);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});
