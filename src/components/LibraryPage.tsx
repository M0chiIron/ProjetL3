import { useEffect, useState } from "react";
import axios from "axios";
import BookCardLibrary from "./BookCardLibrary";
import './LibraryPage.css';

interface Book {
  key: string;
  id: number;
  title: string;
  author_name: string[];
  cover_i: number;
  type_library: LibraryCategory;
  rating?: number | null;
}

type LibraryCategory = "read" | "reading" | "to_read" | "all";

const LibraryPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory>("all");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/library");
        console.log("Books from API:", response.data.books);
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (bookId: number) => {
    console.log("Deleting book with ID:", bookId);
    try {
      const response = await axios.post("/api/remove-from-library", { bookId });
      if (response.data.success) {
        console.log("Book deleted successfully");
        setBooks(books.filter((book) => book.id !== bookId));
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const getCategoryTitle = (categoryType: string): string => {
    switch (categoryType) {
      case "read": return "Livres lus";
      case "reading": return "En cours de lecture";
      case "to_read": return "À lire";
      default: return "";
    }
  };

  const filterBooksByCategory = (categoryType: LibraryCategory): Book[] => {
    if (categoryType === "all") return books;
    return books.filter(book => book.type_library === categoryType);
  };

  const readBooks = filterBooksByCategory("read").slice(0, 5);
  const readingBooks = filterBooksByCategory("reading").slice(0, 5);
  const toReadBooks = filterBooksByCategory("to_read").slice(0, 5);
  
  const displayedBooks = selectedCategory !== "all" 
    ? filterBooksByCategory(selectedCategory)
    : [];
  
  return (
    <div className="library-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ma Bibliothèque</h1>

      <div className="library-categories">
        <button 
          className={`category-button ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          Toutes les catégories
        </button>
        <button 
          className={`category-button ${selectedCategory === "read" ? "active" : ""}`}
          onClick={() => setSelectedCategory("read")}
        >
          Livres lus ({filterBooksByCategory("read").length})
        </button>
        <button 
          className={`category-button ${selectedCategory === "reading" ? "active" : ""}`}
          onClick={() => setSelectedCategory("reading")}
        >
          En cours de lecture ({filterBooksByCategory("reading").length})
        </button>
        <button 
          className={`category-button ${selectedCategory === "to_read" ? "active" : ""}`}
          onClick={() => setSelectedCategory("to_read")}
        >
          À lire ({filterBooksByCategory("to_read").length})
        </button>
      </div>

      {selectedCategory === "all" ? (
        <>
          {["read", "reading", "to_read"].map((categoryType) => {
            const booksInCategory = filterBooksByCategory(categoryType as LibraryCategory);
            if (booksInCategory.length === 0) return null;
            
            return (
              <div key={categoryType} className="category-section">
                <div className="category-header">
                  <h2 className="category-title">{getCategoryTitle(categoryType)}</h2>
                  <button 
                    className="see-all-button"
                    onClick={() => setSelectedCategory(categoryType as LibraryCategory)}
                  >
                    Voir tout
                  </button>
                </div>
                <div className="book-list">
                  {categoryType === "read" && readBooks.map((book) => (
                    <BookCardLibrary
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author_name={book.author_name}
                      cover_i={book.cover_i}
                      rating={book.rating}
                      type_library={book.type_library}
                      onDelete={handleDelete}
                      coverLink={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
                    />
                  ))}
                  {categoryType === "reading" && readingBooks.map((book) => (
                    <BookCardLibrary
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author_name={book.author_name}
                      cover_i={book.cover_i}
                      type_library={book.type_library}
                      onDelete={handleDelete}
                      coverLink={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
                    />
                  ))}
                  {categoryType === "to_read" && toReadBooks.map((book) => (
                    <BookCardLibrary
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author_name={book.author_name}
                      cover_i={book.cover_i}
                      type_library={book.type_library}
                      onDelete={handleDelete}
                      coverLink={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="category-section">
          <h2 className="category-title">{getCategoryTitle(selectedCategory)}</h2>
          {displayedBooks.length === 0 ? (
            <p>Aucun livre dans cette catégorie.</p>
          ) : (
            <div className="book-list">
              {displayedBooks.map((book) => (
                <BookCardLibrary
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author_name={book.author_name}
                  cover_i={book.cover_i}
                  rating={book.rating}
                  type_library={book.type_library}
                  onDelete={handleDelete}
                  coverLink={`/book/${encodeURIComponent(book.key.split('/').pop() || '')}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;