import { requireAuth } from "../lib/auth.js";
import { readAll } from "../lib/store.js";

export default requireAuth(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const data = await readAll();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});
