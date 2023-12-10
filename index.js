import express from "express";
import cors from "cors";
import LoginRoutes from "./Login/routes.js";
import ProfileRoutes from "./Profile/routes.js";
import DetailsRoutes from "./Details/routes.js";
import TestRoutes from "./Test/routes.js";
import session from "express-session";

const app = express();
const port = 3000;

app.use(
  cors({
    credentials: true,
    origin: "http://splendorous-granita-a0f737.netlify.app/",
  })
);
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(express.json());

LoginRoutes(app);
ProfileRoutes(app);
DetailsRoutes(app);
TestRoutes(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
