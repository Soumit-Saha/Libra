export interface Author {
  id: string;
  name: string;
  oneLiner: string;
  bio: string;
  photoURL: string;       // high-quality portrait placeholder
  born: string;           // e.g. "1896, St. Paul, Minnesota, USA"
  died?: string;          // e.g. "1940" — omit if still living
  nationality: string;
  genres: string[];
  notableWorks: string[]; // titles (may include works not in library)
  awards?: string[];
  website?: string;
}

// ─── Author data ─────────────────────────────────────────────────────────────
// Photos → dicebear Avataaars + UI Faces (CC-licensed placeholder portraits)
export const authors: Author[] = [
  {
    id: "fitzgerald",
    name: "F. Scott Fitzgerald",
    oneLiner: "The poet laureate of the Jazz Age who gilded the American Dream.",
    bio: `Francis Scott Key Fitzgerald (1896–1940) was an American novelist, essayist, short-story writer, and screenwriter. He is best known for his novels depicting the flamboyance and excess of the Jazz Age. A member of the 'Lost Generation' of the 1920s, Fitzgerald believed that talent alone was not enough to guarantee success; discipline and the right social connections were equally important. His marriage to Zelda Sayre was as turbulent as his literary output was brilliant — plagued by alcoholism, mental illness, and financial ruin. Fitzgerald died believing himself a failure, unaware that future generations would rank him among the greatest American writers of the twentieth century.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=fitzgerald&backgroundColor=1e1b4b&top=shortHair&accessoriesChance=20",
    born: "1896, St. Paul, Minnesota, USA",
    died: "1940",
    nationality: "American",
    genres: ["Classic Fiction", "Literary Fiction", "Romance"],
    notableWorks: ["The Great Gatsby", "Tender Is the Night", "This Side of Paradise", "The Beautiful and Damned"],
    awards: ["Noted posthumously as one of the great American novelists"]
  },
  {
    id: "orwell",
    name: "George Orwell",
    oneLiner: "Democratic socialist whose pen became the 20th century's sharpest political scalpel.",
    bio: `Eric Arthur Blair (1903–1950), known by his pen name George Orwell, was an English novelist, essayist, journalist, and critic. His work is characterised by lucid prose, biting social criticism, opposition to totalitarianism, and support of democratic socialism. Born in British India, Orwell was educated at Eton and served with the Imperial Police in Burma before returning to Europe where he experienced poverty firsthand — material he transformed into his early writing. His experiences during the Spanish Civil War and his disillusionment with Stalinism shaped his masterworks Animal Farm (1945) and Nineteen Eighty-Four (1949). Orwell died of tuberculosis at age 46, weeks after completing his final manuscript.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=orwell&backgroundColor=1e1b4b&top=shortHair&facialHairChance=60",
    born: "1903, Motihari, Bengal Presidency, British India",
    died: "1950",
    nationality: "British",
    genres: ["Dystopian", "Political Fiction", "Satire", "Essay"],
    notableWorks: ["1984", "Animal Farm", "Homage to Catalonia", "Down and Out in Paris and London"],
    awards: ["Prometheus Award (posthumous, 1984)"]
  },
  {
    id: "austen",
    name: "Jane Austen",
    oneLiner: "Quietly revolutionary — she turned the drawing room into a battlefield of wit.",
    bio: `Jane Austen (1775–1817) was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century. Austen's plots often explore the dependence of women on marriage in the pursuit of favourable social standing and economic security. Her works are a critique of the novels of sensibility of the second half of the 18th century and are part of the transition to 19th-century literary realism. Her use of social commentary, realism and biting irony have earned her a place as one of the most beloved British writers. Austen published all her novels anonymously during her lifetime, credited only as 'A Lady'.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=austen&backgroundColor=1e1b4b&top=longHair&accessories=prescription01",
    born: "1775, Steventon, Hampshire, England",
    died: "1817",
    nationality: "British",
    genres: ["Romance", "Classic Fiction", "Social Commentary"],
    notableWorks: ["Pride and Prejudice", "Sense and Sensibility", "Emma", "Mansfield Park", "Persuasion"],
    awards: ["One of the most widely read novelists in English literature"]
  },
  {
    id: "doyle",
    name: "Arthur Conan Doyle",
    oneLiner: "Created the world's most famous detective — then tried in vain to kill him.",
    bio: `Sir Arthur Ignatius Conan Doyle (1859–1930) was a British author and physician, most noted for creating the fictional detective Sherlock Holmes. Born in Edinburgh, he studied medicine at the University of Edinburgh Medical School, where one of his professors — the observationally gifted Dr. Joseph Bell — became the inspiration for Holmes. Beyond the Holmes canon, Doyle wrote historical novels, science fiction, plays, romances, poetry, non-fiction, and several other detective stories. Despite his literary success, Doyle grew so tired of Holmes that he attempted to kill the character at Reichenbach Falls in 1893 — public outcry forced a resurrection a decade later.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=doyle&backgroundColor=1e1b4b&top=shortHair&facialHairChance=80",
    born: "1859, Edinburgh, Scotland",
    died: "1930",
    nationality: "British",
    genres: ["Mystery", "Detective Fiction", "Science Fiction", "Historical Fiction"],
    notableWorks: ["The Adventures of Sherlock Holmes", "The Hound of the Baskervilles", "The Lost World", "A Study in Scarlet"],
    awards: ["Knight Bachelor (1902)"]
  },
  {
    id: "melville",
    name: "Herman Melville",
    oneLiner: "Sailed the Pacific, survived cannibals, then wrote the greatest American novel.",
    bio: `Herman Melville (1819–1891) was an American novelist, short-story writer, and poet of the American Renaissance period. His early novels, based on his experiences at sea, were popular successes. But his masterpiece, Moby-Dick (1851), was initially considered a disappointment; it was not until decades after his death that it gained recognition as one of the great works of American literature. Melville's writing is characterised by its allusive style, rich symbolism, and philosophical depth. Largely forgotten in his later years, he died in obscurity working as a customs inspector in New York — a quiet end for a writer who had once escaped Polynesian cannibals.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=melville&backgroundColor=1e1b4b&top=shortHair&facialHairChance=70",
    born: "1819, New York City, USA",
    died: "1891",
    nationality: "American",
    genres: ["Adventure", "Philosophical Fiction", "Sea Literature"],
    notableWorks: ["Moby Dick", "Billy Budd", "Bartleby, the Scrivener", "Typee"],
    awards: ["Posthumously recognised as a foundational American author"]
  },
  {
    id: "shelley",
    name: "Mary Shelley",
    oneLiner: "At 18, she invented modern science fiction on a stormy night in Geneva.",
    bio: `Mary Wollstonecraft Shelley (1797–1851) was an English novelist who wrote the Gothic novel Frankenstein; or, The Modern Prometheus (1818), which is considered an early example of science fiction. She also edited and promoted the works of her husband, the Romantic poet Percy Bysshe Shelley. Born to political philosopher William Godwin and feminist Mary Wollstonecraft, she grew up immersed in radical thought. At the age of 16 she began a relationship with the married Percy Shelley. Frankenstein was conceived during a famous ghost-story competition at the Villa Diodati near Lake Geneva, in the company of Lord Byron, John Polidori, and Percy Shelley. She is often called the 'Mother of Science Fiction'.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=shelley&backgroundColor=1e1b4b&top=longHair&accessories=kurt",
    born: "1797, London, England",
    died: "1851",
    nationality: "British",
    genres: ["Gothic Horror", "Science Fiction", "Romantic Fiction"],
    notableWorks: ["Frankenstein", "The Last Man", "Valperga", "Mathilda"],
    awards: ["Mother of Science Fiction (honorary)"]
  },
  {
    id: "carroll",
    name: "Lewis Carroll",
    oneLiner: "A mathematics lecturer who dreamed in nonsense and changed children's literature forever.",
    bio: `Charles Lutwidge Dodgson (1832–1898), better known by his pen name Lewis Carroll, was an English author, poet, and mathematician. His most notable works are Alice's Adventures in Wonderland (1865) and its sequel Through the Looking-Glass (1871). Carroll's writing is celebrated for its imaginative wordplay, logic, and fantasy. He was also a skilled photographer and the inventor of recreational logic puzzles. He was a lecturer in mathematics at Christ Church, Oxford. The Alice story was originally told extemporaneously to Alice Liddell and her sisters during a boating trip on the River Thames in 1862 — a tale Carroll expanded into the published novel at Alice's request.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=carroll&backgroundColor=1e1b4b&top=shortHair&accessories=prescription02",
    born: "1832, Daresbury, Cheshire, England",
    died: "1898",
    nationality: "British",
    genres: ["Fantasy", "Children's Literature", "Nonsense Fiction"],
    notableWorks: ["Alice's Adventures in Wonderland", "Through the Looking-Glass", "The Hunting of the Snark", "Sylvie and Bruno"],
    awards: ["One of the most quoted writers in the English language"]
  },
  {
    id: "wilde",
    name: "Oscar Wilde",
    oneLiner: "He dressed outrageously, wrote flawlessly, and lived even more brilliantly.",
    bio: `Oscar Fingal O'Flahertie Wills Wilde (1854–1900) was an Irish poet and playwright. After writing in different forms throughout the 1880s, he became one of London's most popular playwrights in the early 1890s. He is best remembered for his epigrams and plays, his novel The Picture of Dorian Gray (1890), and the circumstances of his imprisonment and early death. Wilde's brilliant wit, flamboyant style, and aesthetic philosophy made him a celebrated figure in Victorian society — until his conviction for 'gross indecency' in 1895. Imprisoned for two years with hard labour, he emerged broken and went into exile in Paris, where he died destitute at 46, reportedly quipping: 'My wallpaper and I are fighting a duel to the death. One or the other of us has to go.'`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=wilde&backgroundColor=1e1b4b&top=longHair&accessories=wayfarers",
    born: "1854, Dublin, Ireland",
    died: "1900",
    nationality: "Irish",
    genres: ["Gothic Fiction", "Comedy", "Satire", "Drama"],
    notableWorks: ["The Picture of Dorian Gray", "The Importance of Being Earnest", "An Ideal Husband", "Lady Windermere's Fan"],
    awards: ["Newdigate Prize for Poetry (1878)"]
  },
  {
    id: "stoker",
    name: "Bram Stoker",
    oneLiner: "A theatre manager by day who created the Prince of Darkness by night.",
    bio: `Abraham 'Bram' Stoker (1847–1912) was an Irish author of Gothic horror fiction, best known today for his 1897 Gothic horror novel Dracula. During his lifetime, he was better known as the personal assistant of actor Henry Irving and business manager of the Lyceum Theatre in London. Stoker researched Dracula extensively, drawing on Eastern European folklore, medieval history, and contemporary accounts of vampirism. He consulted maps, timetables, and medical literature to give the novel a realistic texture. Though not the first vampire story, Dracula codified the genre's mythology so completely that virtually every vampire story since owes it a debt.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=stoker&backgroundColor=1e1b4b&top=shortHair&facialHairChance=60",
    born: "1847, Clontarf, Dublin, Ireland",
    died: "1912",
    nationality: "Irish",
    genres: ["Horror", "Gothic Fiction", "Epistolary Fiction"],
    notableWorks: ["Dracula", "The Lair of the White Worm", "The Jewel of Seven Stars", "The Lady of the Shroud"],
    awards: ["Legacy Award: defined vampire fiction for all generations"]
  },
  {
    id: "wells",
    name: "H.G. Wells",
    oneLiner: "The Father of Science Fiction — he imagined atom bombs, tanks and the internet decades early.",
    bio: `Herbert George Wells (1866–1946) was an English writer. Prolific in many genres, he wrote dozens of novels, short stories, and works of social commentary, satire, biography, and autobiography, including even two books on war games. He is now best remembered for his science fiction novels and is called the 'Father of Science Fiction'. His most notable science fiction works include The Time Machine (1895), The Island of Doctor Moreau (1896), The Invisible Man (1897), and The War of the Worlds (1898). Wells was a socialist and his later work became increasingly political and didactic. He said his childhood injury and forced bed rest led him to read voraciously — an accident that produced a visionary.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=wells&backgroundColor=1e1b4b&top=shortHair&accessories=prescription01&facialHairChance=40",
    born: "1866, Bromley, Kent, England",
    died: "1946",
    nationality: "British",
    genres: ["Science Fiction", "Dystopian", "Social Satire"],
    notableWorks: ["The War of the Worlds", "The Time Machine", "The Invisible Man", "The Island of Doctor Moreau"],
    awards: ["Father of Science Fiction (honorary)"]
  },
  {
    id: "dostoevsky",
    name: "Fyodor Dostoevsky",
    oneLiner: "Sentenced to death, reprieved at the last second — he wrote novels about that mercy.",
    bio: `Fyodor Mikhailovich Dostoevsky (1821–1881) was a Russian novelist, short-story writer, essayist, and journalist. Dostoevsky's literary works explore the human psychology against the backdrop of the troubled political, social, and spiritual atmosphere of 19th-century Russia. As a young man he was condemned to death for his involvement with a socialist group, only to receive a last-minute reprieve on the execution ground; his sentence was commuted to four years of forced labour in Siberia. This experience of near-death, exile, and deprivation transformed him profoundly and became the emotional bedrock of his greatest novels. His major works include Crime and Punishment, The Idiot, The Possessed, and The Brothers Karamazov.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=dostoevsky&backgroundColor=1e1b4b&top=shortHair&facialHairChance=80",
    born: "1821, Moscow, Russia",
    died: "1881",
    nationality: "Russian",
    genres: ["Psychological Fiction", "Philosophical Fiction", "Realist Fiction"],
    notableWorks: ["Crime and Punishment", "The Brothers Karamazov", "The Idiot", "Notes from Underground"],
    awards: ["One of the greatest psychological novelists of all time (by critical consensus)"]
  },
  {
    id: "kipling",
    name: "Rudyard Kipling",
    oneLiner: "The voice of Empire — and, paradoxically, the poet of its animal innocents.",
    bio: `Joseph Rudyard Kipling (1865–1936) was an English novelist, short-story writer, poet, and journalist. He was born in Bombay, in the Bombay Presidency of British India, and was taken by his parents to England when he was five years old. His works of fiction include The Jungle Book (1894), Kim (1901), and many short stories, including The Man Who Would Be King (1888). His poems include Mandalay (1890), Gunga Din (1890), The Gods of the Copybook Headings (1919), The White Man's Burden (1899), and If— (1910). He is regarded as a major innovator in the art of the short story. He received the Nobel Prize in Literature in 1907, making him the first English-language writer to receive the prize, and its youngest recipient at the time.`,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=kipling&backgroundColor=1e1b4b&top=shortHair&accessories=kurt&facialHairChance=65",
    born: "1865, Bombay (Mumbai), British India",
    died: "1936",
    nationality: "British",
    genres: ["Adventure", "Children's Literature", "Poetry", "Imperial Fiction"],
    notableWorks: ["The Jungle Book", "Kim", "Just So Stories", "The Man Who Would Be King"],
    awards: ["Nobel Prize in Literature (1907)"]
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getAuthorById = (id: string): Author | undefined =>
  authors.find(a => a.id === id);

export const getAuthorByName = (name: string): Author | undefined =>
  authors.find(a => a.name.toLowerCase() === name.toLowerCase());
