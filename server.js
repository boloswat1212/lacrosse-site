const express = require("express");
const fs = require("fs");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(session({
  secret: "lacrossehubsecret",
  resave: false,
  saveUninitialized: true
}));

app.use(express.static("public"));

/* =========================================
   AUTO GENERATED PLAYERS
========================================= */

let generatedPlayers = [];

const firstNames = [
  "Blake","Tyler","Mason","Carter","Logan","Hunter","Aiden",
  "Jackson","Liam","Noah","Ethan","Luke","Ryan","Connor",
  "Wyatt","Brady","Cole","Chase","Dylan","Owen"
];

const lastNames = [
  "Johnson","Smith","Brown","Wilson","Davis","Miller",
  "Anderson","Thomas","Moore","White","Hall","Allen",
  "Young","King","Scott","Green","Baker","Adams"
];

const positions = [
  "Attack",
  "Midfield",
  "Defense",
  "Goalie",
  "LSM",
  "FOGO"
];

const states = [
  "MI",
  "NY",
  "MD",
  "PA",
  "NJ",
  "CA",
  "FL",
  "OH"
];

const schools = [
  "Detroit Country Day",
  "Brother Rice",
  "Culver Academy",
  "St Anthony's",
  "McDonogh",
  "IMG Academy",
  "Landon",
  "Hill Academy",
  "Delbarton",
  "Haverford"
];

const teams = [
  "Brother Rice Varsity",
  "Detroit Country Day Varsity",
  "Culver Varsity",
  "St Anthony's Varsity",
  "IMG Varsity",
  "McDonogh Varsity",
  "Landon Varsity",
  "Hill Academy Varsity",
  "Delbarton Varsity",
  "Haverford Varsity"
];

for(let i = 1; i <= 200; i++){

  generatedPlayers.push({

    name:
      firstNames[Math.floor(Math.random()*firstNames.length)]
      + " " +
      lastNames[Math.floor(Math.random()*lastNames.length)],

    grad: "2030",

    position:
      positions[Math.floor(Math.random()*positions.length)],

    state:
      states[Math.floor(Math.random()*states.length)],

    school:
      schools[Math.floor(Math.random()*schools.length)],

    stars:
      Math.floor(Math.random()*3)+3,

    rank: i,

    commit:
      teams[Math.floor(Math.random()*teams.length)]

  });

}

/* =========================================
   DATABASE
========================================= */

let data = {
  players: generatedPlayers,
  rankings: [],
  events: [
    {
      name: "NXT Fall Showcase",
      location: "Pennsylvania",
      date: "2026-10-12",
      link: "https://www.insidelacrosse.com",
      logo: "https://www.insidelacrosse.com/favicon.ico"
    },
    {
      name: "Inside Lacrosse Invitational",
      location: "Maryland",
      date: "2026-07-20",
      link: "https://www.insidelacrosse.com",
      logo: "https://www.insidelacrosse.com/favicon.ico"
    },
    {
      name: "National 175 Camp",
      location: "Pennsylvania",
      date: "2026-07-10",
      link: "https://www.insidelacrosse.com",
      logo: "https://www.insidelacrosse.com/favicon.ico"
    }
  ]
};

function requireLogin(req, res, next){

  if(req.session.loggedIn){
    next();
  } else {
    res.status(401).json({
      error: "Not logged in"
    });
  }

}

/* =========================================
   LOGIN
========================================= */

app.post("/login", (req, res) => {

  if(req.body.password === "admin123"){

    req.session.loggedIn = true;

    res.json({
      success: true
    });

  } else {

    res.json({
      success: false
    });

  }

});

/* =========================================
   PLAYERS API
========================================= */

app.get("/api/players", (req, res) => {

  const sorted = data.players.sort((a,b)=>
    a.rank - b.rank
  );

  res.json(sorted);

});

/* =========================================
   EVENTS API
========================================= */

app.get("/api/events", (req, res) => {

  const today = new Date();

  const futureEvents = data.events.filter(event => {
    return new Date(event.date) >= today;
  });

  futureEvents.sort((a,b)=>
    new Date(a.date)-new Date(b.date)
  );

  res.json(futureEvents);

});

/* =========================================
   RANKINGS API
========================================= */

app.get("/api/rankings/:year", (req, res) => {

  res.json(data.players);

});

/* =========================================
   START SERVER
========================================= */

app.listen(3000, () => {

  console.log(
    "Server running on http://localhost:3000"
  );

});