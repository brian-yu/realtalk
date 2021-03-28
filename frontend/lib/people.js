export const people = [
  {
    name: "Albert Einstein",
    id: "einstein",
    video: "/portraits/einstein.mp4",
    bio:
      "German-born theoretical physicist who developed the theory of relativity",
    voiceCloningAvailable: false,
  },
  {
    name: "Marie Curie",
    id: "curie",
    video: "/portraits/curie.mp4",
    bio:
      "French physicist and chemist who conducted pioneering research on radioactivity",
    voiceCloningAvailable: false,
  },
  {
    name: "Barack Obama",
    id: "obama",
    video: "/portraits/obama.mp4",
    bio:
      "American politician and attorney who served as the 44th president of the United States",
    voiceCloningAvailable: true,
  },
  {
    name: "Martin Luther King Jr.",
    id: "king",
    video: "/portraits/king.mp4",
    bio:
      "American minister and activist who became the most visible spokesperson and leader in the American civil rights movement",
    voiceCloningAvailable: true,
  },
  {
    name: "Kamala Harris",
    id: "harris",
    video: "/portraits/harris.mp4",
    bio:
      "American politician and attorney serving as the 49th vice president of the United States",
    voiceCloningAvailable: true,
  },
  {
    name: "Richard Feynman",
    id: "feynman",
    video: "/portraits/feynman.mp4",
    bio:
      "American theoretical physicist known for his work in quantum mechanics and quantum electrodynamics",
    voiceCloningAvailable: true,
  },
  {
    name: "Rosalind Franklin",
    id: "franklin",
    video: "/portraits/franklin.mp4",
    bio:
      "English chemist whose work was central to the understanding of the molecular structures of DNA, RNA, and graphite",
    voiceCloningAvailable: false,
  },
  {
    name: "John Lennon",
    id: "lennon",
    video: "/portraits/lennon.mp4",
    bio:
      "English singer, songwriter, musician and peace activist who achieved worldwide fame as the founder, co-lead vocalist, and rhythm guitarist of the Beatles",
    voiceCloningAvailable: false,
  },
  {
    name: "Amelia Earhart",
    id: "earhart",
    video: "/portraits/earhart.mp4",
    bio:
      "American aviation pioneer and author who was the first female aviator to fly solo across the Atlantic Ocean",
    voiceCloningAvailable: false,
  },
  {
    name: "Hermione Granger",
    id: "granger",
    video: "/portraits/granger.mp4",
    bio:
      "best friend of Harry Potter's who often uses her quick wit, deft recall, and encyclopaedic knowledge to lend aid in dire situations",
    voiceCloningAvailable: true,
  },
  {
    name: "James Bond",
    id: "bond",
    video: "/portraits/bond.mp4",
    bio:
      "Secret Intelligence Service agent, code number 007, residing in London but active internationally",
    voiceCloningAvailable: true,
  },
];

export const peopleMap = Object.fromEntries(people.map((obj) => [obj.id, obj]));
