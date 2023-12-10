import { User, Movie, Review } from "../database.js";
import { getUserProfileInfo } from "../utils.js";

const ProfileRoutes = (app) => {
  app.get("/logged-in", async (req, res) => {
    res.json({
      message: "Success",
      session: req.session["currentUser"],
    });
  });

  app.get("/logout", async (req, res) => {
    req.session.destroy();

    res.json({
      message: "Success",
    });
  });

  // gets a profile
  app.get("/profile", async (req, res) => {
    if ("userId" in req.query) {
      const userId = req.query.userId;

      if (userId !== "undefined") {
        const user = await getUserProfileInfo(userId);

        if (user) {
          res.json({
            data: user,
            message: "Success",
            session: req.session[`currentUser`],
          });
        } else {
          res.json({
            message: "User does not exist",
          });
        }
      } else {
        res.json({ message: "UserId is undefined" });
      }
    } else {
      res.json({
        message: "UserId is required",
      });
    }
  });

  app.get("/member-reviews", async (req, res) => {
    // get the first 7 Reviews
    try {
      const reviews = await Review.find({}).limit(7);

      const movieIds = reviews.map((review) => review.movieId);

      const movies = await Movie.find({
        _id: { $in: movieIds },
      });
      const apiMovieIds = movies.map((movie) => movie.movieId);

      res.json({
        data: apiMovieIds,
        message: "Success",
      });
    } catch (error) {
      console.log(error);
      return;
    }
  });

  // gets the apiMovieIds of all the movies that the given user
  // reviewed
  app.get("/reviewed-movies", async (req, res) => {
    const userId = req.query.userId;

    // get all Reviews with userId
    const reviews = await Review.find({ userId: userId });

    // turn list of Reviews into list of movie._ids
    const allMovieIds = reviews.map((review) => review.movieId);

    // get all Movies that have movie._id in ReviewsMapped
    const movies = await Movie.find({
      _id: { $in: allMovieIds },
    });

    // turn list of movies in list of apiMovieIds
    const apiMovieIds = movies.map((movie) => movie.movieId);

    res.json({
      data: apiMovieIds,
      message: "Success",
    });
  });

  // gets the apiMovieIds of all the movies that the given user
  // liked
  app.get("/liked-movies", async (req, res) => {
    const userId = req.query.userId;

    // get list of liked movies from User using userId
    const user = await User.findById(userId);

    // get list of Movies using list of liked movies
    const likedMovies = await Movie.find({ _id: { $in: user.likes } });

    // turn list of movies into apiMovieIds
    const apiMovieIds = likedMovies.map((movie) => movie.movieId);

    res.json({
      data: apiMovieIds,
      message: "Success",
    });
  });

  // return true if given userId is following otherUserId and
  // false if not
  app.post("/profile-following", async (req, res) => {
    const { userId, otherUserId } = req.body;

    if (userId && otherUserId) {
      const user = await User.findById(userId).exec();

      const isFollowing =
        user.following.filter(
          (currUserId) => String(currUserId) === otherUserId
        ).length === 1;

      res.json({
        data: isFollowing,
        message: "Success",
      });
    } else {
      res.json({
        message: "UserId and otherUserId are required",
      });
    }
  });

  // updates a profile
  app.put("/profile", async (req, res) => {
    const user = req.body;
    const userToUpdate = {
      _id: user._id,
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      favoriteGenre: user.favoriteGenre,
    };

    await User.findByIdAndUpdate(userToUpdate._id, userToUpdate);

    const updatedUser = await getUserProfileInfo(userToUpdate._id);
    req.session["currentUser"] = updatedUser;

    if (updatedUser) {
      res.json({
        message: "Success",
        data: updatedUser,
      });
    } else {
      res.json({
        messsage: "User not returned",
      });
    }
  });

  app.put("/follow", async (req, res) => {
    const { userId, otherUserId } = req.body;

    // insert userId into otherUserId.followers
    await User.findByIdAndUpdate(otherUserId, {
      $push: { followers: userId },
    });

    // insert otherUserId into userId.following
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { following: otherUserId },
      },
      { new: true }
    );

    const isFollowing =
      user.following.filter((currUser) => String(currUser) === otherUserId)
        .length === 1;

    res.json({
      message: "Success",
      data: isFollowing,
    });
  });

  app.put("/unfollow", async (req, res) => {
    const { userId, otherUserId } = req.body;

    // remove userId into otherUserId.followers
    await User.findByIdAndUpdate(otherUserId, {
      $pull: { followers: userId },
    });

    // remove otherUserId into userId.following
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: otherUserId },
      },
      { new: true }
    );

    const isFollowing =
      user.following.filter((currUser) => String(currUser) === otherUserId)
        .length === 1;

    res.json({
      message: "Success",
      data: isFollowing,
    });
  });

  // TODO: delete this! This is for testing puposes so you can see in the db
  app.get("/all", async (req, res) => {
    const user = await User.find({});

    res.send(user);
  });
};

export default ProfileRoutes;
