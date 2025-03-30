import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import './BookDetail.css';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Rating, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [authors, setAuthors] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [libraryType, setLibraryType] = useState<string>("to_read");
  const [rating, setRating] = useState<number | null>(null);
  const [userBook, setUserBook] = useState<any>(null);
  const [ratingStats, setRatingStats] = useState<number[]>([0, 0, 0, 0, 0]);

  const calculateAverageRating = (stats: number[]): number => {
    const totalRatings = stats.reduce((sum, count) => sum + count, 0);
    const weightedSum = stats.reduce((sum, count, index) => sum + count * (index + 1), 0);
    return totalRatings === 0 ? 0 : weightedSum / totalRatings;
  };

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

    axios.get(`/api/book/${id}`)
      .then(response => {
        if (response.data.book) {
          setUserBook(response.data.book);
          setLibraryType(response.data.book.type_library);
          setRating(response.data.book.rating || null);
        }
      })
      .catch(error => {
        console.error("Error checking book status:", error);
      });

    if (id) {
      axios.get(`/api/book/${id}/ratings`)
        .then(response => {
          if (response.data.success) {
            setRatingStats(response.data.ratingDistribution);
          }
        })
        .catch(error => {
          console.error("Error fetching rating statistics:", error);
        });
    }
  }, [id]);

  const handleLibraryTypeChange = (event: SelectChangeEvent) => {
    setLibraryType(event.target.value);
  };

  const handleRatingChange = (_: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setRating(newValue);
      setLibraryType("read");
      
      handleAddToLibrary(newValue, "read");
    }
  };

  const handleAddToLibrary = async (ratingValue = rating, typeValue = libraryType) => {
    try {
      const response = await axios.post("/api/add-to-library", {
        key: book.key,
        title: book.title,
        author_name: authors.map((author: any) => author.name),
        cover_i: book.covers ? book.covers[0] : null,
        type_library: typeValue,
        rating: ratingValue
      });
      if (response.data.success) {
        setMessage("Book added to library!");
        setUserBook(response.data.book);
        
        axios.get(`/api/book/${id}/ratings`)
          .then(response => {
            if (response.data.success) {
              setRatingStats(response.data.ratingDistribution);
            }
          });
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
    <div className="book-detail container">
  {message && <p className="message">{message}</p>}
  <div className="book-header">
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
      </div>
    </div>
    <div className="rating-section"> 
  </div>
      <div className="rating-section">
      <div className="rating-container" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '15px' }}>
        <Typography component="legend" className="rating-label">Votre note</Typography>
        <Rating
          name="book-rating"
          value={rating}
          onChange={handleRatingChange}
          size="large"
          precision={1}
          sx={{
            '& .MuiRating-iconFilled': { color: '#007bff' },
            '& .MuiRating-iconEmpty': { color: '#555' },
          }}
        />
      </div>

      <div className="rating-chart-container" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '15px' }}>
        <Typography component="legend" className="rating-label">
          Distribution des notes
        </Typography>
        <BarChart
          xAxis={[{
            id: 'ratings',
            data: [1, 2, 3, 4, 5],
            scaleType: 'band',
            label: 'Note',
          }]}
          series={[{
            data: ratingStats,
          }]}
          height={250}
          width={300}
          sx={{
            borderRadius: '8px',
          }}
        />
        <div style={{ marginLeft: '20px', textAlign: 'center' }}>
          <Typography component="legend" className="rating-label">
            Note Moyenne
          </Typography>
          <Typography variant="h4" style={{ color: '#f0f0f0' }}>
            {calculateAverageRating(ratingStats).toFixed(1)}
          </Typography>
       </div>
      </div>

      <FormControl
        fullWidth
        size="small"
        sx={{
          m: 1,
          minWidth: 200,
          backgroundColor: '#1a1a1a',
          borderRadius: '4px',
          '& .MuiInputLabel-root': { color: '#f0f0f0' },
          '& .MuiSelect-root': { color: '#f0f0f0' },
        }}
      >
        <InputLabel id="library-type-label">Statut de lecture</InputLabel>
        <Select
          labelId="library-type-label"
          id="library-type"
          value={libraryType}
          label="Statut de lecture"
          onChange={handleLibraryTypeChange}
        >
          <MenuItem value="read">Lu</MenuItem>
          <MenuItem value="reading">En lecture</MenuItem>
          <MenuItem value="to_read">À lire</MenuItem>
        </Select>
      </FormControl>
          
          <button className="add-to-library-button" onClick={() => handleAddToLibrary()}>
            {userBook ? "Mettre à jour dans la bibliothèque" : "Ajouter à la bibliothèque"}
          </button>
        </div>
      </div>
  );
};

export default BookDetail;