import { Schema, model } from "mongoose";

const CustomRoleSchema = new Schema({
  _id: String,
  roles: [
    {
      id: String,
      owner: String,
    },
  ],
});

export default model("CustomRole", CustomRoleSchema);
