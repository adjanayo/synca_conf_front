import { useQuery } from "@tanstack/react-query";
import { getCampaignWindows } from "@/lib/api/registration";
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

// Dates de l'événement pilotées par le back-office (fenêtre de campagne
// "event", cf. AdminCampaignWindowsPage) — repli sur PARAMETER.date tant
// que la fenêtre n'a pas chargé ou si l'appel échoue.
export function useEventWindow() {
  const query = useQuery({
    queryKey: ["public", "campaign-windows"],
    queryFn: getCampaignWindows,
    staleTime: 5 * 60 * 1000,
  });

  const eventWindow = query.data?.find((w) => w.key === "event");

  return {
    startAt: eventWindow ? new Date(eventWindow.start_at) : null,
    dateLabel: eventWindow ? formatRange(eventWindow.start_at, eventWindow.end_at) : PARAMETER.date,
  };
}
