import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createHackathonTeam,
  createHackathonTeamMember,
  createParticipant,
  deleteHackathonTeam,
  deleteHackathonTeamMember,
  listHackathonTeams,
  searchParticipants,
  updateHackathonTeam,
  updateHackathonTeamMember,
  type HackathonTeam,
  type HackathonTeamMember,
  type Participant,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";

// ---------- Team form (create/edit) ----------

type TeamFormState = {
  university_name: string;
  name: string;
  project_name: string;
  project_description: string;
};

const EMPTY_TEAM_FORM: TeamFormState = {
  university_name: "",
  name: "",
  project_name: "",
  project_description: "",
};

function teamToForm(t: HackathonTeam): TeamFormState {
  return {
    university_name: t.university_name,
    name: t.name,
    project_name: t.project_name,
    project_description: t.project_description,
  };
}

function TeamFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: HackathonTeam | null;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<TeamFormState>(EMPTY_TEAM_FORM);

  useEffect(() => {
    if (open) setForm(editing ? teamToForm(editing) : EMPTY_TEAM_FORM);
  }, [open, editing]);

  const mutation = useMutation({
    mutationFn: () => (editing ? updateHackathonTeam(editing.id, form) : createHackathonTeam(form)),
    onSuccess: () => {
      toast.success(editing ? "Équipe mise à jour." : "Équipe créée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "hackathon-teams"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit =
    form.university_name.trim() !== "" &&
    form.name.trim() !== "" &&
    form.project_name.trim() !== "" &&
    form.project_description.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier l'équipe" : "Nouvelle équipe"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="team-university">Université</Label>
            <Input
              id="team-university"
              value={form.university_name}
              onChange={(e) => setForm((f) => ({ ...f, university_name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="team-name">Nom de l'équipe</Label>
            <Input
              id="team-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="team-project-name">Nom du projet</Label>
            <Input
              id="team-project-name"
              value={form.project_name}
              onChange={(e) => setForm((f) => ({ ...f, project_name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="team-project-description">Description du projet</Label>
            <Textarea
              id="team-project-description"
              value={form.project_description}
              onChange={(e) => setForm((f) => ({ ...f, project_description: e.target.value }))}
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

// ---------- Members ----------

// Lie un membre d'équipe à un compte participant réel (table `users`) --
// soit en cherchant un compte déjà inscrit, soit en en créant un
// directement depuis le dashboard (les étudiants du hackathon ne passent
// pas forcément par la billetterie publique). Demande explicite utilisateur.
function ParticipantPicker({
  currentUserId,
  onLink,
}: {
  currentUserId: number | null | undefined;
  onLink: (participant: Participant) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"search" | "create">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Participant[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const searchMutation = useMutation({
    mutationFn: () => searchParticipants(query),
    onSuccess: (data) => setResults(data),
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createParticipant({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_whatsapp: phone,
        country,
        city,
      }),
    onSuccess: (participant) => {
      toast.success("Compte participant créé.");
      onLink(participant);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  if (!open) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">
          {currentUserId ? `Compte participant lié (#${currentUserId})` : "Aucun compte lié"}
        </span>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          {currentUserId ? "Changer" : "Lier un participant"}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-border p-3 space-y-2 bg-muted/30">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={mode === "search" ? "default" : "secondary"}
          onClick={() => setMode("search")}
        >
          Rechercher
        </Button>
        <Button
          size="sm"
          variant={mode === "create" ? "default" : "secondary"}
          onClick={() => setMode("create")}
        >
          Créer un compte
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
      {mode === "search" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Nom ou email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              size="sm"
              disabled={query.trim() === "" || searchMutation.isPending}
              onClick={() => searchMutation.mutate()}
            >
              Chercher
            </Button>
          </div>
          {results.length > 0 && (
            <ul className="space-y-1">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      onLink(p);
                      setOpen(false);
                    }}
                  >
                    {p.first_name} {p.last_name} — {p.email}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Téléphone WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input placeholder="Pays" value={country} onChange={(e) => setCountry(e.target.value)} />
          <Input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
          <Button
            size="sm"
            className="col-span-2"
            disabled={
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim() ||
              !phone.trim() ||
              !country.trim() ||
              !city.trim() ||
              createMutation.isPending
            }
            onClick={() => createMutation.mutate()}
          >
            Créer et lier
          </Button>
        </div>
      )}
    </div>
  );
}

function MemberRow({ teamId, member: m }: { teamId: number; member: HackathonTeamMember }) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(m.full_name);
  const [studyLevel, setStudyLevel] = useState(m.study_level);
  const [specialty, setSpecialty] = useState(m.specialty);
  const [photo, setPhoto] = useState<File | null>(null);
  const [userId, setUserId] = useState(m.user_id);

  useEffect(() => {
    setFullName(m.full_name);
    setStudyLevel(m.study_level);
    setSpecialty(m.specialty);
    setPhoto(null);
    setUserId(m.user_id);
  }, [m.full_name, m.study_level, m.specialty, m.user_id]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateHackathonTeamMember(
        teamId,
        m.id,
        { full_name: fullName, study_level: studyLevel, specialty: specialty, user_id: userId },
        photo,
      ),
    onSuccess: () => {
      toast.success("Membre mis à jour.");
      setPhoto(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "hackathon-teams"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteHackathonTeamMember(teamId, m.id),
    onSuccess: () => {
      toast.success("Membre supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin", "hackathon-teams"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty =
    fullName !== m.full_name ||
    studyLevel !== m.study_level ||
    specialty !== m.specialty ||
    photo !== null ||
    userId !== m.user_id;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 border-b last:border-b-0">
      {m.photo_url ? (
        <img src={m.photo_url} alt={m.full_name} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-muted" />
      )}
      <Input className="w-40" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Input className="w-32" value={studyLevel} onChange={(e) => setStudyLevel(e.target.value)} />
      <Input className="w-40" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
      <Input
        className="w-40 text-xs"
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
      />
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
          if (window.confirm(`Supprimer "${m.full_name}" ?`)) deleteMutation.mutate();
        }}
      >
        Supprimer
      </Button>
      <div className="w-full">
        <ParticipantPicker
          currentUserId={userId}
          onLink={(p) => {
            setUserId(p.id);
            if (!fullName.trim()) setFullName(`${p.first_name} ${p.last_name}`);
          }}
        />
      </div>
    </div>
  );
}

function NewMemberForm({ teamId }: { teamId: number }) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createHackathonTeamMember(
        teamId,
        { full_name: fullName, study_level: studyLevel, specialty, user_id: userId },
        photo,
      ),
    onSuccess: () => {
      toast.success("Membre ajouté.");
      setFullName("");
      setStudyLevel("");
      setSpecialty("");
      setPhoto(null);
      setUserId(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "hackathon-teams"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit = fullName.trim() !== "" && studyLevel.trim() !== "" && specialty.trim() !== "";

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3">
      <Input
        className="w-40"
        placeholder="Nom complet"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        className="w-32"
        placeholder="Niveau d'étude"
        value={studyLevel}
        onChange={(e) => setStudyLevel(e.target.value)}
      />
      <Input
        className="w-40"
        placeholder="Spécialité"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      />
      <Input
        className="w-40 text-xs"
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
      />
      <Button size="sm" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
        Ajouter
      </Button>
      <div className="w-full">
        <ParticipantPicker
          currentUserId={userId}
          onLink={(p) => {
            setUserId(p.id);
            if (!fullName.trim()) setFullName(`${p.first_name} ${p.last_name}`);
          }}
        />
      </div>
    </div>
  );
}

// ---------- Team card ----------

function TeamCard({ team: t, onEdit }: { team: HackathonTeam; onEdit: () => void }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteHackathonTeam(t.id),
    onSuccess: () => {
      toast.success("Équipe supprimée.");
      queryClient.invalidateQueries({ queryKey: ["admin", "hackathon-teams"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.university_name}
          </div>
          <CardTitle className="text-base font-medium text-ink">
            {t.name} — {t.project_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{t.project_description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="secondary" onClick={onEdit}>
            Modifier
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (window.confirm(`Supprimer l'équipe "${t.name}" ?`)) deleteMutation.mutate();
            }}
          >
            Supprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Membres</div>
        {t.members.length === 0 && (
          <p className="text-sm text-muted-foreground py-1">Aucun membre pour l'instant.</p>
        )}
        {t.members.map((m) => (
          <MemberRow key={m.id} teamId={t.id} member={m} />
        ))}
        <NewMemberForm teamId={t.id} />
      </CardContent>
    </Card>
  );
}

export function AdminHackathonPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HackathonTeam | null>(null);

  const teamsQuery = useQuery({
    queryKey: ["admin", "hackathon-teams"],
    queryFn: listHackathonTeams,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Hackathon universitaire</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Nouvelle équipe
        </Button>
      </div>

      {teamsQuery.isPending && <Skeleton className="h-64" />}
      {teamsQuery.isError &&
        !(teamsQuery.error instanceof ApiError && teamsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {teamsQuery.error instanceof ApiError
              ? teamsQuery.error.detail
              : "Impossible de charger les équipes."}
          </p>
        )}
      {teamsQuery.data && teamsQuery.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucune équipe pour l'instant.</p>
      )}
      {teamsQuery.data?.map((t) => (
        <TeamCard
          key={t.id}
          team={t}
          onEdit={() => {
            setEditing(t);
            setDialogOpen(true);
          }}
        />
      ))}

      <TeamFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
    </div>
  );
}
