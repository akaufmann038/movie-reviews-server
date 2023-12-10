import { User, Movie, Review } from "../database.js";

const LoginRoutes = (app) => {
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
      const user = await User.findOne({ username: username }).exec();
      req.session['currentUser'] = user;

      if (user) {
        if (user["password"] === password) {
          res.json({
            data: user,
            message: "Success",
          });
        } else {
          res.json({
            message: "Incorrect password",
          });
        }
      } else {
        res.json({
          message: "Username does not exist",
        });
      }
    } else {
      res.json({
        message: "Proper fields not included",
      });
    }
  });

  app.post("/register", async (req, res) => {
    const { fullName, username, password, userType, genre } = req.body;

    if (
      fullName &&
      username &&
      password &&
      userType &&
      genre &&
      fullName.length > 0 &&
      username.length > 0 &&
      password.length > 0 &&
      userType.length > 0 &&
      genre.length > 0
    ) {
      const user = await User.findOne({ username: username }).exec();
      req.session['currentUser'] = user;

      if (user) {
        res.send("User already exists");
      } else {
        const result = await User.create({
          fullName: fullName,
          username: username,
          password: password,
          userType: userType,
          favoriteGenre: genre,
        });
        res.send("Success");
      }
    } else {
      res.send("Proper fields not included");
    }

    // create and respond with response 200

    // 500 if error occurs in mongo query
  });
};

export default LoginRoutes;
