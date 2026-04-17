export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageURL: string;
  pdf_filePath: string;   // public URL (Supabase or external)
  genre: string;
  year: number;
  pages: number;
  rating: number;
  description: string;
  tags: string[];
  featured?: boolean;
  new?: boolean;
  // Supabase-specific (admin-uploaded books only)
  _pdfPath?: string;      // storage object path for deletion
  _coverPath?: string;
  _dbId?: string;         // row id in the `books` table
}

export const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImageURL: "https://covers.openlibrary.org/b/id/8226561-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf",
    genre: "Classic Fiction",
    year: 1925,
    pages: 180,
    rating: 4.7,
    description: "A portrait of the Jazz Age in all of its decadence and excess, capturing the spirit of the author's generation.",
    tags: ["Classic", "American", "Romance"],
    featured: true
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    coverImageURL: "https://covers.openlibrary.org/b/id/8575708-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/1984.pdf",
    genre: "Dystopian",
    year: 1949,
    pages: 328,
    rating: 4.9,
    description: "A dystopian novel set in a totalitarian society ruled by the Party, where Big Brother watches your every move.",
    tags: ["Dystopia", "Politics", "Sci-Fi"],
    featured: true
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverImageURL: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/pride-and-prejudice.pdf",
    genre: "Romance",
    year: 1813,
    pages: 432,
    rating: 4.8,
    description: "The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education and marriage.",
    tags: ["Romance", "Classic", "British"]
  },
  {
    id: "4",
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    coverImageURL: "https://covers.openlibrary.org/b/id/8458659-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/the-adventures-of-sherlock-holmes.pdf",
    genre: "Mystery",
    year: 1892,
    pages: 307,
    rating: 4.8,
    description: "A collection of twelve stories featuring the famous detective Sherlock Holmes and his assistant Dr. Watson.",
    tags: ["Mystery", "Detective", "Classic"]
  },
  {
    id: "5",
    title: "Moby Dick",
    author: "Herman Melville",
    coverImageURL: "https://covers.openlibrary.org/b/id/8234077-L.jpg",
    pdf_filePath: "https://www.gutenberg.org/files/2701/2701-h/2701-h.htm",
    genre: "Adventure",
    year: 1851,
    pages: 635,
    rating: 4.3,
    description: "The saga of Captain Ahab and his monomaniacal quest to defeat the white whale, Moby Dick.",
    tags: ["Adventure", "Classic", "Sea"]
  },
  {
    id: "6",
    title: "Frankenstein",
    author: "Mary Shelley",
    coverImageURL: "https://covers.openlibrary.org/b/id/8387805-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/frankenstein.pdf",
    genre: "Gothic Horror",
    year: 1818,
    pages: 280,
    rating: 4.5,
    description: "The story of Victor Frankenstein, a scientist who creates a sapient creature in an unorthodox scientific experiment.",
    tags: ["Horror", "Gothic", "Sci-Fi"],
    new: true
  },
  {
    id: "7",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    coverImageURL: "https://covers.openlibrary.org/b/id/8739204-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/alices-adventures-in-wonderland.pdf",
    genre: "Fantasy",
    year: 1865,
    pages: 96,
    rating: 4.6,
    description: "The tale of a girl named Alice who falls through a rabbit hole into a fantasy world populated by peculiar creatures.",
    tags: ["Fantasy", "Children", "Classic"]
  },
  {
    id: "8",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    coverImageURL: "https://covers.openlibrary.org/b/id/8410594-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/the-picture-of-dorian-gray.pdf",
    genre: "Gothic Fiction",
    year: 1890,
    pages: 254,
    rating: 4.7,
    description: "The story of a young man who remains eternally youthful while his portrait bears all the signs of his moral decay.",
    tags: ["Gothic", "Philosophy", "Classic"],
    new: true
  },
  {
    id: "9",
    title: "Dracula",
    author: "Bram Stoker",
    coverImageURL: "https://covers.openlibrary.org/b/id/8410473-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/dracula.pdf",
    genre: "Horror",
    year: 1897,
    pages: 418,
    rating: 4.4,
    description: "The classic horror story about Count Dracula's attempt to move from Transylvania to England so he can find new blood.",
    tags: ["Horror", "Gothic", "Classic"]
  },
  {
    id: "10",
    title: "The War of the Worlds",
    author: "H.G. Wells",
    coverImageURL: "https://covers.openlibrary.org/b/id/8739149-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/the-war-of-the-worlds.pdf",
    genre: "Science Fiction",
    year: 1898,
    pages: 192,
    rating: 4.5,
    description: "An early science fiction novel that describes the invasion of Victorian England by Martians.",
    tags: ["Sci-Fi", "Classic", "Adventure"]
  },
  {
    id: "11",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    coverImageURL: "https://covers.openlibrary.org/b/id/8734261-L.jpg",
    pdf_filePath: "https://www.planetebook.com/free-ebooks/crime-and-punishment.pdf",
    genre: "Psychological Fiction",
    year: 1866,
    pages: 551,
    rating: 4.8,
    description: "The mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished student who formulates a plan to kill a pawnbroker.",
    tags: ["Psychology", "Russian", "Classic"],
    featured: true
  },
  {
    id: "12",
    title: "The Jungle Book",
    author: "Rudyard Kipling",
    coverImageURL: "https://covers.openlibrary.org/b/id/8739226-L.jpg",
    pdf_filePath: "https://www.gutenberg.org/files/236/236-h/236-h.htm",
    genre: "Adventure",
    year: 1894,
    pages: 212,
    rating: 4.4,
    description: "Stories about the adventures of Mowgli, a boy raised by wolves in the jungles of India.",
    tags: ["Adventure", "Children", "Nature"]
  }
];

export const genres = [...new Set(books.map(b => b.genre))];

export const getFeaturedBooks = () => books.filter(b => b.featured);
export const getNewBooks = () => books.filter(b => b.new);
export const getBookById = (id: string) => books.find(b => b.id === id);
