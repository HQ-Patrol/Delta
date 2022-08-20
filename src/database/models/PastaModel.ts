import { Schema, model } from "mongoose";

const PastaSchema = new Schema({
  User: {
    id: String,
    name: String,
  },
  Guild: {
    id: String,
    name: String,
  },
  Word: String,
  Pasta: String,
  Time: String,
});

export default model("Pasta", PastaSchema, "pasta");
