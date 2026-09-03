import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../../components/site/PageHeader";
import { getHackathonTeams, type HackathonTeam } from "../../lib/api/hackathon";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

function groupByUniversity(teams: HackathonTeam[]) {
  const groups = new Map<string, HackathonTeam[]>();
  for (const team of teams) {
    const list = groups.get(team.university_name) ?? [];
    list.push(team);
    groups.set(team.university_name, list);
  }
  return [...groups.entries()];
}

export function HackathonView() {
  useBrandedPageMeta(
    "Hackathon universitaire",
    "Le Hackathon universitaire réunit des équipes de plusieurs universités, sélectionnées via le programme Synca Community Certified.",
  );
  const teams = useQuery({ queryKey: ["public", "hackathon-teams"], queryFn: getHackathonTeams });

  const isEmpty = teams.isSuccess && teams.data.length === 0;
  const groups = teams.isSuccess ? groupByUniversity(teams.data) : [];

  return (
    <>
      <PageHeader
        eyebrow="Hackathon universitaire"
        title={<>Les équipes qui <span className="text-primary">construisent l'avenir</span>.</>}
        description="Le Hackathon universitaire réunit des équipes de plusieurs universités, sélectionnées via le programme Synca Community Certified."
      />
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          {teams.isLoading && (
            <p className="text-center text-muted-foreground py-10">Chargement des équipes…</p>
          )}
          {(teams.isError || isEmpty) && !teams.isLoading && (
            <p className="text-center text-muted-foreground py-10">
              Les équipes du hackathon seront annoncées prochainement. Reviens bientôt pour les découvrir.
            </p>
          )}
          {!teams.isLoading && !teams.isError && !isEmpty && (
            <div className="space-y-12">
              {groups.map(([university, universityTeams]) => (
                <div key={university}>
                  <h2 className="font-display font-bold text-2xl mb-6">{university}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {universityTeams.map((team) => (
                      <article
                        key={team.id}
                        className="rounded-3xl bg-white border border-border p-6 shadow-card"
                      >
                        <div className="text-xs uppercase tracking-widest text-primary font-semibold">
                          {team.name}
                        </div>
                        <h3 className="mt-1 font-display font-bold text-xl">{team.project_name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{team.project_description}</p>

                        {team.members.length > 0 && (
                          <ul className="mt-5 flex flex-wrap gap-4">
                            {team.members.map((member) => (
                              <li key={member.id} className="flex items-center gap-2">
                                {member.photo_url ? (
                                  <img
                                    src={member.photo_url}
                                    alt={member.full_name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-ink/20" />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-foreground">
                                    {member.full_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {member.study_level} · {member.specialty}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
