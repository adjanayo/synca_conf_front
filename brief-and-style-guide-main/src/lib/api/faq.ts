import { apiFetch } from "./client";

export type FaqCategoryPublic = { id: number; name: string };

export type FaqPublic = {
  id: number;
  category_id: number;
  question: string;
  answer: string;
  sort_order: number;
};

export function getFaqCategories() {
  return apiFetch<FaqCategoryPublic[]>("/api/faq-categories");
}

export function getFaqs() {
  return apiFetch<FaqPublic[]>("/api/faqs?limit=200");
}
