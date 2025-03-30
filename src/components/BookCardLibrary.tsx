import React from "react";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import './BookCard.css';

interface BookCardLibraryProps {
  id: number;
  title: string;
  author_name: string[];
  cover_i: number;
  rating?: number | null;
  type_library: string;
  onDelete: (id: number) => void;
  coverLink: string; 
}

const BookCardLibrary: React.FC<BookCardLibraryProps> = ({ 
  id, 
  title, 
  author_name, 
  cover_i, 
  rating,
  type_library, 
  onDelete, 
  coverLink 
}) => {
  const handleDeleteClick = () => {
    onDelete(id); 
  };

  return (
    <div className="book-card">
      <Link to={coverLink}>
        <img
          src={`https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`}
          alt={`Couverture de ${title}`}
          className="book-cover"
        />
      </Link>
      <h2 className="book-title">{title}</h2>
      <p className="book-author">{author_name.join(", ")}</p>
      
      {type_library === "read" && (
        <div className="book-rating">
          <Rating 
            name="read-only" 
            value={rating || 0} 
            readOnly 
            size="small" 
            precision={1} 
          />
        </div>
      )}

      <IconButton aria-label="delete" onClick={handleDeleteClick}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default BookCardLibrary;