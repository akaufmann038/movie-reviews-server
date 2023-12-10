import axios from "axios";
import { User, Movie, Review } from "./database.js";

const MOVIE_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U";

export const getMovie = async (movieId) => {
  try {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${MOVIE_API_KEY}`,
    };
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      { headers }
    );

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getUserProfileInfo = async (userId) => {
  let user = await User.findById(userId).exec();
  user = user.toObject();

  // reviews: movie name, score, apiMovieId (for link)
  // { movieName: ..., score: ..., apiMovieId: ... }

  let reviews = await Review.find({
    _id: { $in: user.reviews },
  });

  // get reviewed movies
  const reviewedMovies = await Movie.find({
    _id: { $in: reviews.map((review) => review.movieId) },
  });

  const movieInfo = [];
  for (let i = 0; i < reviewedMovies.length; i++) {
    const apiMovie = await getMovie(reviewedMovies[i].movieId);
    movieInfo.push({
      movieName: apiMovie.data.original_title,
      movieId: reviewedMovies[i].movieId,
      _id: reviewedMovies[i]._id,
    });
  }

  // insert movieName and movieId into reviews and set this in user.reviews
  reviews = reviews.map((review) => {
    const reviewObj = review.toObject();
    const currMovieInfo = movieInfo.find(
      (obj) => String(obj._id) === String(reviewObj.movieId)
    );

    return {
      ...reviewObj,
      movieName: currMovieInfo.movieName,
      apiMovieId: currMovieInfo.movieId,
    };
  });
  user.reviews = reviews;

  // likes: movie name, apiMovieId (for link)
  let likes = await Movie.find({
    _id: { $in: user.likes },
  });
  const likesInfo = [];
  for (let i = 0; i < likes.length; i++) {
    const apiMovie = await getMovie(likes[i].movieId);
    likesInfo.push({
      movieName: apiMovie.data.original_title,
      apiMovieId: likes[i].movieId,
    });
  }
  user.likes = likesInfo;

  // followers: username
  const followers = await User.find(
    { _id: { $in: user.followers } },
    { username: 1 }
  );
  user.followers = followers;

  // following: username
  const following = await User.find(
    { _id: { $in: user.following } },
    { username: 1 }
  );
  user.following = following;

  return user;
};

// given a movieId, gets all the reviews with the
// usernames of the reviewers included
export const getReviews = async (movieId) => {
  const reviews = await Review.find({ movieId: movieId });
  const objectReviews = reviews.map((review) => review.toObject());

  for (let i = 0; i < reviews.length; i++) {
    const currReview = reviews[i];

    const currUser = await User.findById(currReview.userId);
    objectReviews[i]["username"] = currUser.username;
  }

  return objectReviews;
};
