import { User, Movie, Review } from "../database.js";

const fakeUsers = [
  {
    _id: "655f60bbf65bf6edd371d5ac",
    fullName: "Alice Johnson",
    username: "alice",
    password: "password",
    userType: "reviewer",
    favoriteGenre: "fantasy",
    reviews: ["655f64f056a39c765cb1c110", "655f64f056a39c765cb1c111"],
    following: ["655f60bbf65bf6edd371d5ad", "655f60bbf65bf6edd371d5ae"],
    followers: ["655f60bbf65bf6edd371d5ad"],
    likes: ["655f626d1a0fcd5781e2b967", "655f626d1a0fcd5781e2b968"],
  },
  {
    _id: "655f60bbf65bf6edd371d5ad",
    fullName: "Bob Smith",
    username: "bob",
    password: "password",
    userType: "reader",
    favoriteGenre: "sci-fi",
    reviews: [],
    following: ["655f60bbf65bf6edd371d5ac", "655f60bbf65bf6edd371d5ae"],
    followers: ["655f60bbf65bf6edd371d5ac"],
    likes: [],
  },
  {
    _id: "655f60bbf65bf6edd371d5ae",
    fullName: "Carol White",
    username: "carol",
    password: "password",
    userType: "reader",
    favoriteGenre: "mystery",
    reviews: [],
    following: ["655f60bbf65bf6edd371d5ad"],
    followers: ["655f60bbf65bf6edd371d5ac"],
    likes: [],
  },
  {
    _id: "655f60bbf65bf6edd371d5af",
    fullName: "David Lee",
    username: "david",
    password: "password",
    userType: "reviewer",
    favoriteGenre: "horror",
    reviews: [],
    following: [],
    followers: [],
    likes: [],
  },
  {
    _id: "655f60bbf65bf6edd371d5b0",
    fullName: "Eva Green",
    username: "eva",
    password: "password",
    userType: "reader",
    favoriteGenre: "romance",
    reviews: [],
    following: [],
    followers: [],
    likes: [],
  },
];

// routes for creating test data
// just clear the database before doing this, uncomment
// that line in database.js
const TestRoutes = (app) => {
  app.get("/create", async (req, res) => {
    // create users
    const users = await User.insertMany(fakeUsers);

    // create movies
    const movies = await Movie.insertMany([
      {
        _id: "655f626d1a0fcd5781e2b967",
        movieId: 787699,
        likers: ["655f60bbf65bf6edd371d5ac"],
      },
      {
        _id: "655f626d1a0fcd5781e2b968",
        movieId: 901362,
        likers: ["655f60bbf65bf6edd371d5ac"],
      },
    ]);

    // create reviews
    const reviews = await Review.insertMany([
      {
        score: 10,
        text: "It's a great movie!",
        movieId: "655f626d1a0fcd5781e2b967",
        userId: "655f60bbf65bf6edd371d5ac",
        _id: "655f64f056a39c765cb1c110",
      },
      {
        score: 2,
        text: "It's a horrible movie!",
        movieId: "655f626d1a0fcd5781e2b968",
        userId: "655f60bbf65bf6edd371d5ac",
        _id: "655f64f056a39c765cb1c111",
      },
    ]);

    res.send("Done!");
  });

  app.get("/like-movies", async (req, res) => {
    await User.findByIdAndUpdate("6553d9b7aef89db674b4af7f", update, options);
  });
};

export default TestRoutes;
