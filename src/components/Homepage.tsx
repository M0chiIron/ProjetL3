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
    const fetchPopularBooks = async () => {
      try {
        const response = await axios.get("/api/popular-books");
        if (response.data.success) {
          setBooks(response.data.books);
        }
      } catch (error) {
        console.error("Error fetching popular books:", error);
      }
    };

    fetchPopularBooks();
  }, []);

  return (
    <div className="homepage">
      <h1 className="text-2xl font-bold mb-4">Livres Populaires</h1>
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