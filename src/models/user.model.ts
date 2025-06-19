import { Schema, model, models, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
