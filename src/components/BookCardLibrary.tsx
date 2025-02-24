import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import './BookCard.css';

interface BookCardLibraryProps {
  key: string;
  title: string;
  author_name: string[];
  cover_i: number;
  onDelete: () => void; 
}

const BookCardLibrary: React.FC<BookCardLibraryProps> = ({ title, author_name, cover_i, onDelete }) => {
  return (
    <div className="book-card">
      <img
        src={`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`}
        alt={title}
        className="book-cover"
      />
      <h2 className="book-title">{title}</h2>
      <p className="book-author">{author_name.join(", ")}</p>
      <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
    </div>
  );
};

export default BookCardLibrary;