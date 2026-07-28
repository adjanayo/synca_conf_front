function Stats() {
  const items = [
    { v: "+2 000", l: "Participants" },
    { v: "+10", l: "Pays représentés" },
    { v: "+30", l: "Startups" },
    { v: "3", l: "Jours d'événement" },
  ];
  return (
    <section className="bg-primary text-ink">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((i) => (
          <div key={i.l} className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl">{i.v}</div>
            <div className="mt-1 text-sm font-medium opacity-80">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


export {
    Stats
}
