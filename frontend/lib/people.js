export const people = [
  {
    name: "Richard Feynman",
    id: "feynman",
    video: "/portraits/feynman.mp4",
    bio:
      "American theoretical physicist known for his work in quantum mechanics and quantum electrodynamics",
  },
  {
    name: "Marie Curie",
    id: "curie",
    video: "/portraits/curie.mp4",
    bio:
      "French physicist and chemist who conducted pioneering research on radioactivity",
  },
  {
    name: "Barack Obama",
    id: "obama",
    video: "/portraits/obama.mp4",
    bio:
      "American politician and attorney who served as the 44th president of the United States",
  },
  {
    name: "Kamala Harris",
    id: "harris",
    video: "/portraits/harris.mp4",
    bio:
      "American politician and attorney serving as the 49th vice president of the United States",
  },
];

export const peopleMap = Object.fromEntries(people.map((obj) => [obj.id, obj]));