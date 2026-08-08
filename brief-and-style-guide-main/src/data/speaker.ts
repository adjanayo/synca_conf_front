

const SPEAKERS = Array.from({ length: 10 }).map((_, i) => ({
  n: "À annoncer",
  r: ["TCHASSEI Ramadhan", "Panel · Cyber", "Fireside · Product", "Workshop · Data", "Keynote · WIT", "Panel · EdTech", "Lightning · Founders", "Workshop · DevOps", "Panel · Carrières", "Keynote · Impact"][i],
  c: ["from-orange-200 to-orange-400", "from-amber-100 to-orange-300", "from-orange-100 to-rose-300", "from-yellow-100 to-orange-300", "from-pink-100 to-orange-300", "from-orange-200 to-amber-300", "from-rose-200 to-orange-300", "from-amber-200 to-orange-400", "from-orange-100 to-amber-200", "from-orange-200 to-rose-300"][i],
}));


export { SPEAKERS }