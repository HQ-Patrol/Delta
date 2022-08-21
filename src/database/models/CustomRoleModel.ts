import { Schema, model } from "mongoose";

interface ICustomRole {
  _id: string,
  roles: Array<object>
}

const CustomRoleSchema = new Schema<ICustomRole>({
  _id: String,
  roles: [
    {
      id: String,
      owner: String,
    },
  ],
});

export const CustomRoleModel = model<ICustomRole>("CustomRole", CustomRoleSchema);
