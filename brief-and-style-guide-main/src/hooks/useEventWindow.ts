import { useQuery } from "@tanstack/react-query";
import { getCampaignWindows, getEventSettings } from "@/lib/api/registration";
import { PARAMETER } from "@/data/parameter";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

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
  };
}
