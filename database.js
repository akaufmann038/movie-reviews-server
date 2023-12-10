import mongoose from "mongoose";
// const connectionString = "mongodb://localhost:27017/db";
const connectionString =
  "mongodb+srv://akaufmann038:GBQHaRhf6lQhssKQ@cluster0.ilqmfjz.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

// TODO: just for testing - uncomment this and save to clear the entire database
// mongoose.connection
//   .dropDatabase()
//   .then(() => console.log("Database dropped successfully"))
//   .catch((err) => console.error("Error dropping database:", err));

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    // acts as a unique identifier
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["reader", "reviewer"],
    required: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
});

const movieSchema = new Schema({
  movieId: { type: Number, required: true }, // api movie id
  likers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const reviewSchema = new Schema({
  score: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export const User = mongoose.model("User", userSchema);
export const Movie = mongoose.model("Movie", movieSchema);
export const Review = mongoose.model("Review", reviewSchema);
