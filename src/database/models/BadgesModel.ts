import { Schema, model } from "mongoose";
import { IBadge } from "../../types/Badge";

interface IBadges {
  id: string;
  badges: IBadge[];
}

const BadgesSchema = new Schema<IBadges>({
  id: String,
  badges: [],
});

export const BadgesModel = model<IBadges>("AFK", BadgesSchema);
