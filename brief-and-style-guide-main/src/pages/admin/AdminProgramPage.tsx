import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createDay,
  createSession,
  deleteDay,
  deleteSession,
  listDays,
  listSessions,
  updateDay,
  updateSession,
  type Day,
  type Session,
  type SessionCategory,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const CATEGORY_LABELS: Record<SessionCategory, string> = {
  panel: "Panel",
  workshop: "Atelier",
  competition: "Compétition",
  keynote: "Keynote",
  lightning_talk: "Lightning Talk",
  fireside_chat: "Fireside Chat",
  b2b: "B2B",
  job_fair: "Job Fair",
  networking: "Networking",
  after_party: "After Party",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as SessionCategory[];

// ---------- Days ----------

function DayRow({ day: d }: { day: Day }) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(d.date);
  const [label, setLabel] = useState(d.label);

  useEffect(() => {
    setDate(d.date);
    setLabel(d.label);
  }, [d.date, d.label]);

  const updateMutation = useMutation({
    mutationFn: () => updateDay(d.id, { date, label }),
    onSuccess: () => {
      toast.success("Jour mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "days"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDay(d.id),
    onSuccess: () => {
      toast.success("Jour supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin", "days"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty = date !== d.date || label !== d.label;

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
      <Input
        className="w-40"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input className="flex-1" value={label} onChange={(e) => setLabel(e.target.value)} />
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
          if (window.confirm(`Supprimer le jour "${d.label}" ?`)) deleteMutation.mutate();
        }}
      >
        Supprimer
      </Button>
    </div>
  );
}

function NewDayForm() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");

  const mutation = useMutation({
    mutationFn: () => createDay({ date, label }),
    onSuccess: () => {
      toast.success("Jour créé.");
      setDate("");
      setLabel("");
      queryClient.invalidateQueries({ queryKey: ["admin", "days"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit = date.trim() !== "" && label.trim() !== "";

  return (
    <div className="flex items-center gap-3 pt-3">
      <Input
        className="w-40"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        className="flex-1"
        placeholder="Libellé (ex: Jour 1)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <Button size="sm" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
        Ajouter
      </Button>
    </div>
  );
}

function DaysSection() {
  const daysQuery = useQuery({
    queryKey: ["admin", "days"],
    queryFn: listDays,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <Card className="mb-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Jours</CardTitle>
      </CardHeader>
      <CardContent>
        {daysQuery.isPending && <Skeleton className="h-24" />}
        {daysQuery.isError &&
          !(daysQuery.error instanceof ApiError && daysQuery.error.status === 401) && (
            <p role="alert" className="text-sm text-destructive">
              {daysQuery.error instanceof ApiError
                ? daysQuery.error.detail
                : "Impossible de charger les jours."}
            </p>
          )}
        {daysQuery.data && (
          <div>
            {daysQuery.data.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">Aucun jour pour l'instant.</p>
            )}
            {daysQuery.data.map((d) => (
              <DayRow key={d.id} day={d} />
            ))}
          </div>
        )}
        <NewDayForm />
      </CardContent>
    </Card>
  );
}

// ---------- Sessions ----------

type SessionFormState = {
  day_id: string;
  title: string;
  description: string;
  category: SessionCategory;
  start_time: string;
  end_time: string;
  room: string;
  speaker_id: string;
  is_public: boolean;
};

const EMPTY_SESSION_FORM: SessionFormState = {
  day_id: "",
  title: "",
  description: "",
  category: "panel",
  start_time: "",
  end_time: "",
  room: "",
  speaker_id: "",
  is_public: true,
};

function sessionToForm(s: Session): SessionFormState {
  return {
    day_id: String(s.day_id),
    title: s.title,
    description: s.description ?? "",
    category: s.category as SessionCategory,
    start_time: s.start_time.slice(0, 5),
    end_time: s.end_time.slice(0, 5),
    room: s.room ?? "",
    speaker_id: s.speaker_id !== null ? String(s.speaker_id) : "",
    is_public: s.is_public,
  };
}

function SessionFormDialog({
  open,
  onOpenChange,
  days,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  days: Day[];
  editing: Session | null;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SessionFormState>(EMPTY_SESSION_FORM);

  useEffect(() => {
    if (open) {
      setForm(editing ? sessionToForm(editing) : EMPTY_SESSION_FORM);
    }
  }, [open, editing]);

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        day_id: Number(form.day_id),
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        start_time: `${form.start_time}:00`,
        end_time: `${form.end_time}:00`,
        room: form.room || undefined,
        speaker_id: form.speaker_id ? Number(form.speaker_id) : undefined,
        is_public: form.is_public,
      };
      return editing ? updateSession(editing.id, body) : createSession(body);
    },
    onSuccess: () => {
      toast.success(editing ? "Session mise à jour." : "Session créée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit =
    form.day_id !== "" && form.title.trim() !== "" && form.start_time !== "" && form.end_time !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="session-day">Jour</Label>
              <Select value={form.day_id} onValueChange={(v) => setForm((f) => ({ ...f, day_id: v }))}>
                <SelectTrigger id="session-day">
                  <SelectValue placeholder="Choisir un jour" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="session-category">Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as SessionCategory }))}
              >
                <SelectTrigger id="session-category">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="session-title">Titre</Label>
            <Input
              id="session-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="session-description">Description</Label>
            <Textarea
              id="session-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="session-start">Heure de début</Label>
              <Input
                id="session-start"
                type="time"
                value={form.start_time}
                onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="session-end">Heure de fin</Label>
              <Input
                id="session-end"
                type="time"
                value={form.end_time}
                onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="session-room">Salle</Label>
              <Input
                id="session-room"
                value={form.room}
                onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="session-speaker">ID speaker</Label>
              <Input
                id="session-speaker"
                type="number"
                value={form.speaker_id}
                onChange={(e) => setForm((f) => ({ ...f, speaker_id: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="session-public"
              checked={form.is_public}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_public: v }))}
            />
            <Label htmlFor="session-public">Session publique</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={!canSubmit || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {editing ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SessionsSection({ days }: { days: Day[] }) {
  const queryClient = useQueryClient();
  const [dayFilter, setDayFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);

  const filters = dayFilter === "all" ? {} : { day_id: Number(dayFilter) };

  const sessionsQuery = useQuery({
    queryKey: ["admin", "sessions", filters],
    queryFn: () => listSessions(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSession(id),
    onSuccess: () => {
      toast.success("Session supprimée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dayLabel = (dayId: number) => days.find((d) => d.id === dayId)?.label ?? `#${dayId}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-ink">Sessions</CardTitle>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Nouvelle session
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={dayFilter} onValueChange={setDayFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filtrer par jour" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les jours</SelectItem>
              {days.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {sessionsQuery.isPending && <Skeleton className="h-64" />}
        {sessionsQuery.isError &&
          !(sessionsQuery.error instanceof ApiError && sessionsQuery.error.status === 401) && (
            <p role="alert" className="text-sm text-destructive">
              {sessionsQuery.error instanceof ApiError
                ? sessionsQuery.error.detail
                : "Impossible de charger les sessions."}
            </p>
          )}

        {sessionsQuery.data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Jour</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionsQuery.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Aucune session pour ces filtres.
                  </TableCell>
                </TableRow>
              )}
              {sessionsQuery.data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>{CATEGORY_LABELS[s.category as SessionCategory] ?? s.category}</TableCell>
                  <TableCell>{dayLabel(s.day_id)}</TableCell>
                  <TableCell>
                    {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                  </TableCell>
                  <TableCell>{s.room ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={s.is_public ? "default" : "secondary"}>
                      {s.is_public ? "Publique" : "Privée"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditing(s);
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
                        if (window.confirm(`Supprimer la session "${s.title}" ?`)) {
                          deleteMutation.mutate(s.id);
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <SessionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        days={days}
        editing={editing}
      />
    </Card>
  );
}

export function AdminProgramPage() {
  const daysQuery = useQuery({
    queryKey: ["admin", "days"],
    queryFn: listDays,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Programme</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <DaysSection />

      {daysQuery.data ? (
        <SessionsSection days={daysQuery.data} />
      ) : (
        <Skeleton className="h-64" />
      )}
    </div>
  );
}
