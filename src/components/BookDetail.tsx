import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [authors, setAuthors] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`https://openlibrary.org/works/${id}.json`)
      .then(res => res.json())
      .then(data => {
        console.log("Book data:", data);
        setBook(data);
        if (data.authors) {
          Promise.all(
            data.authors.map((author: any) =>
              fetch(`https://openlibrary.org${author.author.key}.json`).then(res => res.json())
            )
          ).then(setAuthors);
        }
      });
  }, [id]);

  const handleAddToLibrary = async () => {
    try {
      const response = await axios.post("/api/add-to-library", {
        key: book.key,
        title: book.title,
        author_name: authors.map((author: any) => author.name),
        cover_i: book.covers ? book.covers[0] : null,
      });
      if (response.data.success) {
        setMessage("Book added to library!");
      } else {
        setMessage("Failed to add book to library.");
      }
    } catch (error) {
      console.error("Error adding book to library:", error);
      setMessage("An error occurred while adding the book to the library.");
    }
  };

  if (!book) return <p>Chargement...</p>;

  return (
    <div className="book-detail">
      {message && <p className="message">{message}</p>}
      {book.covers && book.covers.length > 0 && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
          alt={book.title}
          className="book-cover-detail"
        />
      )}
      <div className="book-content-detail">
        <h1 className="book-title-detail">{book.title}</h1>
        <h2 className="book-author-detail">
          {authors.map((author: any, index: number) => (
            <span key={index}>
              <Link to={`/author/${author.key.split('/').pop()}`}>{author.name}</Link>
              {index < authors.length - 1 && ", "}
            </span>
          ))}
        </h2>
        <p className="book-description-detail">{book.description?.value || book.description}</p>
        <button className="add-to-library-button" onClick={handleAddToLibrary}>
          Ajouter à la bibliothèque
        </button>
      </div>
    </div>
  );
};

export default BookDetail;