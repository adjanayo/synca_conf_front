import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createFaq,
  createFaqCategory,
  deleteFaq,
  deleteFaqCategory,
  listFaqCategories,
  listFaqs,
  updateFaq,
  updateFaqCategory,
  type Faq,
  type FaqCategory,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";

// ---------- Categories ----------

function CategoryRow({ category: c }: { category: FaqCategory }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(c.name);

  useEffect(() => {
    setName(c.name);
  }, [c.name]);

  const updateMutation = useMutation({
    mutationFn: () => updateFaqCategory(c.id, { name }),
    onSuccess: () => {
      toast.success("Catégorie mise à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faq-categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFaqCategory(c.id),
    onSuccess: () => {
      toast.success("Catégorie supprimée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faq-categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty = name !== c.name;

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
      <Input className="flex-1" value={name} onChange={(e) => setName(e.target.value)} />
      <Button
        size="sm"
        variant="secondary"
        disabled={!dirty || updateMutation.isPending}
        onClick={() => updateMutation.mutate()}
      >
        Enregistrer
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={deleteMutation.isPending}
        onClick={() => {
          if (window.confirm(`Supprimer la catégorie "${c.name}" ?`)) deleteMutation.mutate();
        }}
      >
        Supprimer
      </Button>
    </div>
  );
}

function NewCategoryForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const mutation = useMutation({
    mutationFn: () => createFaqCategory({ name }),
    onSuccess: () => {
      toast.success("Catégorie créée.");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["admin", "faq-categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <div className="flex items-center gap-3 pt-3">
      <Input
        className="flex-1"
        placeholder="Nouvelle catégorie (ex: Billetterie)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        size="sm"
        disabled={name.trim() === "" || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        Ajouter
      </Button>
    </div>
  );
}

function CategoriesSection({ categories }: { categories: FaqCategory[] }) {
  return (
    <Card className="mb-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Catégories</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">Aucune catégorie pour l'instant.</p>
        )}
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} />
        ))}
        <NewCategoryForm />
      </CardContent>
    </Card>
  );
}

// ---------- Faqs ----------

type FaqFormState = {
  category_id: string;
  question: string;
  answer: string;
  sort_order: string;
};

const EMPTY_FAQ_FORM: FaqFormState = {
  category_id: "",
  question: "",
  answer: "",
  sort_order: "0",
};

function faqToForm(f: Faq): FaqFormState {
  return {
    category_id: String(f.category_id),
    question: f.question,
    answer: f.answer,
    sort_order: String(f.sort_order),
  };
}

function FaqFormDialog({
  open,
  onOpenChange,
  categories,
  defaultCategoryId,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: FaqCategory[];
  defaultCategoryId: number | null;
  editing: Faq | null;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FaqFormState>(EMPTY_FAQ_FORM);

  useEffect(() => {
    if (open) {
      setForm(
        editing
          ? faqToForm(editing)
          : { ...EMPTY_FAQ_FORM, category_id: defaultCategoryId ? String(defaultCategoryId) : "" }
      );
    }
  }, [open, editing, defaultCategoryId]);

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        category_id: Number(form.category_id),
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: Number(form.sort_order) || 0,
      };
      return editing ? updateFaq(editing.id, body) : createFaq(body);
    },
    onSuccess: () => {
      toast.success(editing ? "Question mise à jour." : "Question créée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit =
    form.category_id !== "" && form.question.trim() !== "" && form.answer.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la question" : "Nouvelle question"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="faq-category">Catégorie</Label>
            <select
              id="faq-category"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
            >
              <option value="">— Sélectionner —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="faq-question">Question</Label>
            <Textarea
              id="faq-question"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="faq-answer">Réponse</Label>
            <Textarea
              id="faq-answer"
              rows={5}
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="faq-sort">Ordre d'affichage</Label>
            <Input
              id="faq-sort"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
            {editing ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FaqsSection({ categories }: { categories: FaqCategory[] }) {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<number | null>(categories[0]?.id ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);

  useEffect(() => {
    if (activeCategory === null && categories.length > 0) setActiveCategory(categories[0].id);
  }, [activeCategory, categories]);

  const faqsQuery = useQuery({
    queryKey: ["admin", "faqs", activeCategory],
    queryFn: () => listFaqs(activeCategory !== null ? { category_id: activeCategory } : {}),
    enabled: activeCategory !== null,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess: () => {
      toast.success("Question supprimée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-ink">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-2">
            Crée d'abord une catégorie ci-dessus pour pouvoir y ajouter des questions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-ink">Questions</CardTitle>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Nouvelle question
        </Button>
      </CardHeader>
      <CardContent>
        {/* Onglets par catégorie -- même découpage que la page publique FAQ */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                activeCategory === c.id
                  ? "bg-ink text-white border-ink"
                  : "bg-background text-ink border-border hover:border-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {faqsQuery.isPending && <Skeleton className="h-64" />}
        {faqsQuery.isError &&
          !(faqsQuery.error instanceof ApiError && faqsQuery.error.status === 401) && (
            <p role="alert" className="text-sm text-destructive">
              {faqsQuery.error instanceof ApiError
                ? faqsQuery.error.detail
                : "Impossible de charger les questions."}
            </p>
          )}

        {faqsQuery.data && (
          <div className="space-y-3">
            {faqsQuery.data.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">
                Aucune question dans cette catégorie pour l'instant.
              </p>
            )}
            {faqsQuery.data.map((f) => (
              <div key={f.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-ink">{f.question}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditing(f);
                        setDialogOpen(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm("Supprimer cette question ?")) deleteMutation.mutate(f.id);
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <FaqFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        defaultCategoryId={activeCategory}
        editing={editing}
      />
    </Card>
  );
}

export function AdminFaqPage() {
  const categoriesQuery = useQuery({
    queryKey: ["admin", "faq-categories"],
    queryFn: listFaqCategories,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">FAQ</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      {categoriesQuery.data ? (
        <>
          <CategoriesSection categories={categoriesQuery.data} />
          <FaqsSection categories={categoriesQuery.data} />
        </>
      ) : (
        <Skeleton className="h-64" />
      )}
    </div>
  );
}
