import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Rating } from "@mui/material";
import './SearchPage.css';

interface Book {
  key: string;
  title: string;
  author_name: string[];
  cover_i: number;
}

const SearchPage = () => {
  const { query } = useParams<{ query: string }>();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?q=${query}`
        );
        setBooks(response.data.docs.slice(0, 16));
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div className="search-page mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Résultats pour "{query}"</h1>
      <div className="book-list-search">
        {books.map((book) => (
          <Link
            key={book.key}
            to={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
            className="book-card"
          >
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
              className="book-cover"
            />
            <div className="book-details">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">
                {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
              </p>
              <Rating name="read-only" value={3} readOnly />
            </div>
            <button className="read-button hover:bg-gray-600">Lire</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;