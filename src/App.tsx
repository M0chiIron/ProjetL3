import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import SearchPage from './components/SearchPage';
import BookDetail from './components/BookDetail';
import LoginPage from './components/LoginPage';
import LibraryPage from './components/LibraryPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </Router>
  )
}

export default App;