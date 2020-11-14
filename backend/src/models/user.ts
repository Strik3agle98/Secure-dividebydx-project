import mongoose, { Document, Model, Mongoose, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

export interface User {
  username: string;
  password: string;
  displayName: string;
  role: "admin" | "user";
}

// for method
export interface UserDoc extends User, Document {}

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  password: Schema.Types.String,
  displayName: {
    type: Schema.Types.String,
    required: true,
  },
  role: {
    type: Schema.Types.String,
    enum: ["admin", "user"],
  },
});

UserSchema.pre<UserDoc>("save", async function (next) {
  if (this.isModified() || this.isNew) {
    this.password = await hash(this.password, 8);
  }
  next();
});

UserSchema.statics.findByUsernameAndPassword = async function (
  username: string,
  password: string
): Promise<UserDoc | undefined> {
  const user = await (this as UserModel).findOne({ username });
  if (!user) return undefined;
  const match = await compare(password, user.password);
  if (!match) return undefined;
  return user;
};

export interface UserModel extends Model<UserDoc> {
  findByUsernameAndPassword: (
    username: string,
    password: string
  ) => Promise<UserDoc | undefined>;
}

const UserDb = mongoose.model<UserDoc, UserModel>("User", UserSchema);
export default UserDb;
