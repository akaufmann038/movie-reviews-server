import { User, Movie, Review } from "../database.js";
import { getReviews } from "../utils.js";
import mongoose from "mongoose";

const DetailsRoutes = (app) => {
  // given an apiMovieId, gets all the reviews and user info of likers of the movie
  app.get("/details", async (req, res) => {
    const apiMovieId = req.query.apiMovieId;
    //const apiMovieId = 787699;

    // get movieId from movie object given apiMovieId
    // get likers from movie object given apiMovieId
    const movie = await Movie.find({ movieId: apiMovieId });

    if (movie.length === 0) {
      // movie does not exist so return empty arrays
      res.json({
        data: { reviews: [], likers: [] },
        message: "Success",
      });
    } else {
      const { _id, likers } = movie[0];

      // get all reviews with the given movieId
      const reviews = await getReviews(_id);

      // get users given all userIds from likers
      const users = await User.find({
        _id: { $in: likers },
      });

      /* 
    {
        reviews: [{score, text, movieId, userId}, ...],
        likers: [{userId, username}, ...]
    }
    */
      res.json({
        data: { reviews: reviews, likers: users },
        message: "Success",
      });
    }
  });

  // given a userId, apiMovieId, text, and score, creates a review
  /* Returns:
  {
    reviews: [{reviews for given movie with usernames}, ...]
  }
  */
  app.put("/create-review", async (req, res) => {
    const { userId, apiMovieId, text, score } = req.body;

    // case where movie object is already created and has a review
    // const userId = "655f60bbf65bf6edd371d5ac";
    // const apiMovieId = 901362;
    // const text = "I really dislike this movie a lot";
    // const score = 0;

    // case where movie object is not created and does not have any reviews
    // const userId = "655f60bbf65bf6edd371d5ac";
    // const apiMovieId = 951546;
    // const text = "I really dislike this movie a lot";
    // const score = 0;

    // check if movie object exists using apiMovieId
    // if not, create movie object and get movie
    // if yes, just get movie
    const movie = await Movie.find({ movieId: apiMovieId });
    let movieId = null;

    if (movie.length === 0) {
      const newMovie = await Movie.create({
        movieId: apiMovieId,
        likers: [],
      });

      movieId = newMovie._id;
    } else {
      movieId = movie[0]._id;
    }

    // create review object using req.body data and movie object
    const newReview = await Review.create({
      score: score,
      text: text,
      movieId: movieId,
      userId: userId,
    });

    // add reviewId to user using userId
    await User.findByIdAndUpdate(userId, {
      $push: { reviews: newReview._id },
    });

    const resultReviews = await getReviews(movieId);

    res.json({
      data: { reviews: resultReviews },
      message: "Success",
    });
  });

  app.post("/like-movie", async (req, res) => {
    const userId = req.body.userId;
    const movieId = req.body.movieId;

    // get movie._id by getting Movie using movieId
    const movie = await Movie.findOne({ movieId: movieId });

    if (movie) {
      // add movieId to User using userId to find
      await User.findByIdAndUpdate(userId, {
        $push: { likes: movie._id },
      });

      // add userId to Movie using movieId to find
      const updatedMovie = await Movie.findByIdAndUpdate(
        movie._id,
        {
          $push: { likers: userId },
        },
        { new: true }
      );

      // return all users who liked given movie
      const likers = await User.find({
        _id: { $in: updatedMovie.likers },
      });

      res.json({
        data: { likers: likers },
        message: "Success",
      });
    } else {
      // if movie does not exist, create it
      const newMovie = await Movie.create({
        movieId: movieId,
        likers: [userId],
      });

      // add movieId to User using userId to find
      await User.findByIdAndUpdate(userId, {
        $push: { likes: newMovie._id },
      });

      // return all users who liked given movie
      const likers = await User.find({
        _id: { $in: newMovie.likers },
      });

      res.json({
        data: { likers: likers },
        message: "Success",
      });
    }
  });

  app.post("/unlike-movie", async (req, res) => {
    const userId = req.body.userId;
    const movieId = req.body.movieId;

    // get movie._id by getting Movie using movieId
    const movie = await Movie.findOne({ movieId: movieId });

    // remove movieId from User using userId to find
    await User.findByIdAndUpdate(userId, {
      $pull: { likes: movie._id },
    });

    // remove userId from Movie using movieId to find
    const updatedMovie = await Movie.findByIdAndUpdate(
      movie._id,
      {
        $pull: { likers: userId },
      },
      { new: true }
    );

    // return all users who liked given movie
    const likers = await User.find({
      _id: { $in: updatedMovie.likers },
    });

    res.json({
      data: { likers: likers },
      message: "Success",
    });
  });
};

export default DetailsRoutes;
