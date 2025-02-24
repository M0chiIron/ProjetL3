import React from "react";
import './BookCard.css'; 

interface BookCardProps {
  key: string;
  title: string;
  author_name: string[];
  cover_i: number;
}

const BookCard: React.FC<BookCardProps> = ({ title, author_name, cover_i }) => {
  return (
    <div className="book-card">
      <img
        src={`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`}
        alt={title}
        className="book-cover"
      />
      <h2 className="book-title">{title}</h2>
      <p className="book-author">{author_name.join(", ")}</p>
    </div>
  );
};

export default BookCard;