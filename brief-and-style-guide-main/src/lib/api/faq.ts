import { z } from "zod";
import { apiFetch, apiFetchAll } from "./client";
import { faqCategoryPublicSchema, faqPublicSchema } from "../schemas/public";

export type FaqCategoryPublic = z.infer<typeof faqCategoryPublicSchema>;
export type FaqPublic = z.infer<typeof faqPublicSchema>;

export async function getFaqCategories() {
  const data = await apiFetch<unknown>("/api/faq-categories");
  return z.array(faqCategoryPublicSchema).parse(data);
}

export async function getFaqs() {
  const data = await apiFetchAll<unknown>("/api/faqs");
  return z.array(faqPublicSchema).parse(data);
}
