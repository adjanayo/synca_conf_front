import { useQuery } from "@tanstack/react-query";
import { getCampaignWindows, getEventSettings } from "@/lib/api/registration";
import { PARAMETER } from "@/data/parameter";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const WEEKDAYS_FR = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
];

// Libellé complet d'un jour donné ("Lundi 18 Août 2027") -- utilisé pour les
// en-têtes de jour du programme, calculés depuis la date de début de
// l'événement plutôt que codés en dur (data/programme.ts).
export function formatDayLabel(date: Date): string {
  return `${WEEKDAYS_FR[date.getDay()]} ${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

function formatRange(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const month = MONTHS_FR[end.getMonth()];
  const year = end.getFullYear();
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.getDate()} ${month} ${year}`;
  }
  return `${start.getDate()} ${MONTHS_FR[start.getMonth()]} – ${end.getDate()} ${month} ${year}`;
}

// "mars 2027" -- utilisé pour les phrases "candidatures ouvertes dès..."
// plutôt qu'une date de jour complète.
export function formatMonthYear(date: Date): string {
  return `${MONTHS_FR[date.getMonth()].toLowerCase()} ${date.getFullYear()}`;
}

// Accès générique à une fenêtre de campagne par clé (call_for_speaker,
// call_for_partner, call_for_ambassador, call_for_exhibitor, ticketing) --
// réutilise le même cache que useEventWindow (clé "event"), pas de requête
// réseau supplémentaire.
export function useCampaignWindow(key: string) {
  const query = useQuery({
    queryKey: ["public", "campaign-windows"],
    queryFn: getCampaignWindows,
    staleTime: 5 * 60 * 1000,
  });
  const w = query.data?.find((x) => x.key === key);
  return {
    startAt: w ? new Date(w.start_at) : null,
    endAt: w ? new Date(w.end_at) : null,
    isActive: w?.is_active ?? false,
  };
}

// Dates + nom/lieu de l'événement pilotés par le back-office (fenêtre de
// campagne "event" et EventSettings, cf. AdminEventSettingsPage) — repli sur
// PARAMETER tant que les requêtes n'ont pas chargé ou si l'appel échoue,
// pour que l'édition suivante se configure depuis le dashboard sans redéploi.
export function useEventWindow() {
  const windowsQuery = useQuery({
    queryKey: ["public", "campaign-windows"],
    queryFn: getCampaignWindows,
    staleTime: 5 * 60 * 1000,
  });
  const settingsQuery = useQuery({
    queryKey: ["public", "event-settings"],
    queryFn: getEventSettings,
    staleTime: 5 * 60 * 1000,
  });

  const eventWindow = windowsQuery.data?.find((w) => w.key === "event");

  return {
    startAt: eventWindow ? new Date(eventWindow.start_at) : null,
    dateLabel: eventWindow ? formatRange(eventWindow.start_at, eventWindow.end_at) : PARAMETER.date,
    name: settingsQuery.data?.name ?? PARAMETER.title,
    venue: settingsQuery.data?.venue ?? PARAMETER.lieu,
    // Champ distinct des dates de l'événement (fenêtre `event` ci-dessus) --
    // sert uniquement au texte de marque "Synca Conf <année>" affiché à
    // plusieurs endroits. Pas de repli si non défini en base : on n'affiche
    // simplement pas d'année plutôt que d'en deviner une fausse.
    year: settingsQuery.data?.year ?? null,
  };
}
