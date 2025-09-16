import type { Goal, Category } from "../types";

// Sample goals data - shared across voting and results pages
export const sampleGoals: { [key in Category]: Goal[] } = {
  women: [
    {
      id: "w1",
      title: "Karina Sapio",
      subtitle: "vs BOSA",
      videoUrl: "/gifs/women/2025_kor_v_bosa.webm",
    },
    {
      id: "w2",
      title: "Hannah Roffe",
      subtitle: "vs Adelaide City",
      videoUrl: "/gifs/women/2025_hannah_v_adelaide_city.webm",
    },
    {
      id: "w3",
      title: "Hannah Roffe",
      subtitle: "vs Flinders",
      videoUrl: "/gifs/women/2025_hannah_v_flinders.webm",
    },
    {
      id: "w4",
      title: "Karina Sapio",
      subtitle: "vs Comets (Away)",
      videoUrl: "/gifs/women/2025_karina_v_comets_away.webm",
    },
    {
      id: "w5",
      title: "Karina Sapio",
      subtitle: "vs Comets (Home)",
      videoUrl: "/gifs/women/2025_karina_v_comets.webm",
    },
  ],
  men: [
    {
      id: "m1",
      title: "Jake Dahms",
      subtitle: "vs Mount Barker",
      videoUrl: "/gifs/men/2025_jake_v_barker.webm",
    },
    {
      id: "m2",
      title: "Jonno Eske",
      subtitle: "vs Mclaren",
      videoUrl: "/gifs/men/2025_jonno_v_mclaren.webm",
    },
    {
      id: "m3",
      title: "Karl Carrington",
      subtitle: "vs Mclaren",
      videoUrl: "/gifs/men/2025_karl_v_mclaren.webm",
    },
    {
      id: "m4",
      title: "Ethan Tinnion",
      subtitle: "vs St Pauls",
      videoUrl: "/gifs/men/2025_ethan_v_st_pauls.webm",
    },
    {
      id: "m5",
      title: "Ash Dann",
      subtitle: "vs Flinders",
      videoUrl: "/gifs/men/2025_ash_v_flinders.webm",
    },
  ],
};
