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
    name: "Martin Luther King Jr.",
    id: "king",
    video: "/portraits/king.mp4",
    bio:
      "American minister and activist who became the most visible spokesperson and leader in the American civil rights movement",
  },
  {
    name: "Kamala Harris",
    id: "harris",
    video: "/portraits/harris.mp4",
    bio:
      "American politician and attorney serving as the 49th vice president of the United States",
  },
  {
    name: "Rosalind Franklin",
    id: "franklin",
    video: "/portraits/franklin.mp4",
    bio:
      "English chemist and X-ray crystallographer whose work was central to the understanding of the molecular structures of DNA, RNA, viruses, coal, and graphite.",
  },
  {
    name: "Albert Einstein",
    id: "einstein",
    video: "/portraits/einstein.mp4",
    bio: "German-born theoretical physicist who developed the theory of relativity and is one of the greatest physicists of all time."
  }
];

export const peopleMap = Object.fromEntries(people.map((obj) => [obj.id, obj]));