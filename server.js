import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Projet",
  password: "projetl3",
  port: 5432,
});

app.use(bodyParser.json());
app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } finally {
    client.release();
  }
});

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const client = await pool.connect();
  try {
    const result = await client.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id", [email, hashedPassword]);
    const userId = result.rows[0].id;
    req.session.userId = userId;
    res.json({ success: true });
  } catch (error) {
    console.error("Error registering user:", error);
    res.json({ success: false });
  } finally {
    client.release();
  }
});

app.post("/api/add-to-library", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { key, title, author_name, cover_i } = req.body;
  const client = await pool.connect();
  try {
    const checkResult = await client.query(
      "SELECT * FROM books WHERE user_id = $1 AND key = $2",
      [req.session.userId, key]
    );

    if (checkResult.rows.length > 0) {
      res.json({ success: false, message: "Book already in library" });
    } else {
      const result = await client.query(
        "INSERT INTO books (user_id, key, title, author_name, cover_i) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [req.session.userId, key, title, author_name, cover_i]
      );
      res.json({ success: true, bookId: result.rows[0].id });
    }
  } catch (error) {
    console.error("Error adding book to library:", error);
    res.json({ success: false });
  } finally {
    client.release();
  }
});

app.post("/api/remove-from-library", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { bookId } = req.body;
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM books WHERE id = $1 AND user_id = $2", [bookId, req.session.userId]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing book from library:", error);
    res.json({ success: false });
  } finally {
    client.release();
  }
});

app.get("/api/check-auth", (req, res) => {
  if (req.session.userId) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to log out" });
    }
    res.json({ success: true });
  });
});

app.get("/api/library", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM books WHERE user_id = $1", [req.session.userId]);
    res.json({ books: result.rows });
  } finally {
    client.release();
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});