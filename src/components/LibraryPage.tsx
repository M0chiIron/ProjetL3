import { useEffect, useState } from "react";
import axios from "axios";
import BookCardLibrary from "./BookCardLibrary";
import './LibraryPage.css';

interface Book {
  key: string;
  title: string;
  author_name: string[];
  cover_i: number;
}

const LibraryPage = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/library");
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (key: string) => {
    try {
      await axios.delete(`/api/library/${key}`);
      setBooks(books.filter((book) => book.key !== key));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="library-page">
      <h1 className="text-2xl font-bold mb-4">Ma Bibliothèque</h1>
      <div className="book-list">
        {books.map((book) => (
          <BookCardLibrary
            key={book.key}
            title={book.title}
            author_name={book.author_name}
            cover_i={book.cover_i}
            onDelete={() => handleDelete(book.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;