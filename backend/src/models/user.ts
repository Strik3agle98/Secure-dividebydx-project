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
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    unique: true,
    required: true,
    select: false,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  displayName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    select: false,
  },
});

// UserSchema.pre<UserDoc>("save", async function (next) {
//   console.log("pre save check ???")
//   if (this.isModified() || this.isNew) {
//     this.password = await hash(this.password, 8);
//     console.log("--> hash")
//   }
//   next();
// });

// UserSchema.pre<UserDoc>("insertMany", async function (next) {
//   console.log(this);
//   this.password = await hash(this.password, 8);
//   next();
// });

UserSchema.statics.findByUsernameAndPassword = async function (
  username: string,
  password: string
): Promise<UserDoc | undefined> {
  const user = await (this as UserModel)
    .findOne({ username })
    .select("password username role");
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
