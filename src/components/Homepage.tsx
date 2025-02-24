import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './Homepage.css'; 
import BookCard from "./BookCard";

interface Book {
  key: string;
  title: string;
  author_name: string[];
  cover_i: number;
}

const Homepage = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://openlibrary.org/search.json?subject=fiction&limit=5"
        );
        setBooks(response.data.docs.slice(0, 5));
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="homepage">
      <h1 className="text-2xl font-bold mb-4">Livres "Populaires"</h1>
      <div className="book-list">
        {books.map((book) => (
            <Link
            key={book.key}
            to={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
            className="book-card"
          >
            <BookCard
                key={book.key}
                title={book.title}
                author_name={book.author_name}
                cover_i={book.cover_i}
            />
            </Link>
        ))}
      </div>
    </div>
  );
};

export default Homepage;