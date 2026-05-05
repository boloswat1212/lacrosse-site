console.log("USING JSON SERVER");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");

const app = express();

/* LOAD DATA */
let data = { players: [], events: [], rankings: [] };

try {
  data = JSON.parse(fs.readFileSync("data.json"));
} catch {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

function saveData() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

app.use(session({
  secret: "lacrosse-secret",
  resave: false,
  saveUninitialized: true
}));

app.use(express.static("public"));

/* LOGIN */
const ADMIN_PASSWORD = "1234";

app.post("/api/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

/* AUTH */
function requireLogin(req, res, next) {
  if (!req.session.loggedIn) {
    return res.status(401).json({ error: "Not authorized" });
  }
  next();
}

/* ROUTES */
app.get("/api/players", (req, res) => res.json(data.players));

app.post("/api/add-player", requireLogin, (req, res) => {
  data.players.push(req.body);
  saveData();
  res.json({ success: true });
});

app.get("/api/events", (req, res) => res.json(data.events));

app.post("/api/add-event", requireLogin, (req, res) => {
  data.events.push(req.body);
  saveData();
  res.json({ success: true });
});

app.get("/api/rankings/:year", (req, res) => {
  const results = data.rankings
    .filter(r => r.year == req.params.year)
    .sort((a, b) => a.rank - b.rank);
  res.json(results);
});

app.post("/api/add-ranking", requireLogin, (req, res) => {
  data.rankings.push(req.body);
  saveData();
  res.json({ success: true });
});

/* START */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});