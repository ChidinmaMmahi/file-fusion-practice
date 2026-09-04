import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, getUserId } from "../auth.js";

export const draftsRouter = Router();

draftsRouter.use(requireAuth);

function titleFromHtml(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "Untitled draft";
  return text.slice(0, 80);
}

draftsRouter.get("/", async (req, res) => {
  const userId = getUserId(req);
  const drafts = await prisma.draft.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  res.json({ drafts });
});

draftsRouter.get("/:id", async (req, res) => {
  const userId = getUserId(req);
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Missing draft id" });
    return;
  }
  const draft = await prisma.draft.findFirst({
    where: { id, userId },
  });

  if (!draft) {
    res.status(404).json({ error: "Draft not found" });
    return;
  }

  res.json({ draft });
});

draftsRouter.post("/", async (req, res) => {
  const userId = getUserId(req);
  const htmlContent = typeof req.body?.htmlContent === "string" ? req.body.htmlContent : "";
  const note = typeof req.body?.note === "string" ? req.body.note : "";
  const sourceOrder = Array.isArray(req.body?.sourceOrder)
    ? JSON.stringify(req.body.sourceOrder)
    : typeof req.body?.sourceOrder === "string"
      ? req.body.sourceOrder
      : "[]";
  const title =
    typeof req.body?.title === "string" && req.body.title.trim()
      ? req.body.title.trim()
      : titleFromHtml(htmlContent);

  const draft = await prisma.draft.create({
    data: { userId, htmlContent, note, sourceOrder, title },
  });

  res.status(201).json({ draft });
});

draftsRouter.patch("/:id", async (req, res) => {
  const userId = getUserId(req);
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Missing draft id" });
    return;
  }
  const existing = await prisma.draft.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    res.status(404).json({ error: "Draft not found" });
    return;
  }

  const htmlContent =
    typeof req.body?.htmlContent === "string" ? req.body.htmlContent : existing.htmlContent;
  const note = typeof req.body?.note === "string" ? req.body.note : existing.note;
  const sourceOrder = Array.isArray(req.body?.sourceOrder)
    ? JSON.stringify(req.body.sourceOrder)
    : typeof req.body?.sourceOrder === "string"
      ? req.body.sourceOrder
      : existing.sourceOrder;
  const title =
    typeof req.body?.title === "string" && req.body.title.trim()
      ? req.body.title.trim()
      : titleFromHtml(htmlContent);

  const draft = await prisma.draft.update({
    where: { id: existing.id },
    data: { htmlContent, note, sourceOrder, title },
  });

  res.json({ draft });
});

draftsRouter.delete("/:id", async (req, res) => {
  const userId = getUserId(req);
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: "Missing draft id" });
    return;
  }
  const existing = await prisma.draft.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    res.status(404).json({ error: "Draft not found" });
    return;
  }

  await prisma.draft.delete({ where: { id: existing.id } });
  res.json({ ok: true });
});
