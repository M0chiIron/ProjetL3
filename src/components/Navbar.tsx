import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import './Dropdown-Profile.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get("/api/check-auth").then(response => {
      setIsLoggedIn(response.data.isLoggedIn);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/${search}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white w-full">
      <div className="flex justify-between items-center p-4 container mx-auto">
        <Link to="/" className="text-2xl font-bold">
          BookClub
        </Link>
        <div className="flex items-center">
          <div className="dropdown">
            <Avatar />
            <div className="dropdown-content bg-gray-800 p-2 rounded-md">
              {isLoggedIn ? (
                <>
                  <p className="hover:bg-gray-900 p-2 cursor-pointer">Profile</p>
                  <p className="hover:bg-gray-900 p-2 cursor-pointer">Settings</p>
                  <p className="hover:bg-gray-900 p-2 cursor-pointer" onClick={handleLogout}>Logout</p>
                </>
              ) : (
                <>
                  <p className="hover:bg-gray-900 p-2 cursor-pointer" onClick={handleLogin}>Login</p>
                </>
              )}
            </div>
          </div>
          <Link to="/library" className="ml-2 text-white">
            Bibliothèque
          </Link>
          <Link to="/liste" className="ml-2 text-white margin">
            Listes
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="p-2 rounded-l-md margin-left"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            Rechercher
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;