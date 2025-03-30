import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Rating } from "@mui/material";
import './AuthorPage.css';

interface Book {
  key: string;
  title: string;
  author_name: string[];
  cover_i: number;
  first_publish_year?: number;
}

interface Author {
  name: string;
  birth_date?: string;
  bio?: string | { value: string };
  photos?: number[];
}

const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthorAndBooks = async () => {
      try {
        setLoading(true);
        
        const authorResponse = await axios.get(`https://openlibrary.org/authors/${id}.json`);
        setAuthor(authorResponse.data);
        
        const booksResponse = await axios.get(`https://openlibrary.org/search.json?author=${authorResponse.data.name}&sort=editions&limit=20`);
        setBooks(booksResponse.data.docs.filter((book: Book) => book.cover_i));
      } catch (error) {
        console.error("Error fetching author or books data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorAndBooks();
  }, [id]);

  // Helper function to extract the bio text
  const getBioText = () => {
    if (!author?.bio) return null;
    if (typeof author.bio === 'string') return author.bio;
    if (typeof author.bio === 'object' && 'value' in author.bio) return author.bio.value;
    return null;
  };

  if (loading) return <div className="author-page"><p>Chargement...</p></div>;

  return (
    <div className="author-page">
      <div className="author-header">
        {author?.photos && author.photos.length > 0 && (
          <img 
            src={`https://covers.openlibrary.org/a/id/${author.photos[0]}-M.jpg`}
            alt={author?.name}
            className="author-photo"
          />
        )}
        <div className="author-info">
          <h1 className="author-name">{author?.name}</h1>
          {author?.birth_date && <p className="author-birth">Né(e) en: {author.birth_date}</p>}
          {getBioText() && <p className="author-bio">{getBioText()}</p>}
        </div>
      </div>

      <h2 className="section-title">Œuvres de {author?.name}</h2>
      
      <div className="books-grid">
        {books.length === 0 ? (
          <p>Aucun livre trouvé pour cet auteur.</p>
        ) : (
          books.map((book) => (
            <Link
              key={book.key}
              to={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
              className="book-link"
            >
              <div className="book-card">
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="book-cover"
                />
                <h3 className="book-title">{book.title}</h3>
                {book.first_publish_year && <p className="book-year">{book.first_publish_year}</p>}
                <Rating name="read-only" value={3} readOnly size="small" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorPage;