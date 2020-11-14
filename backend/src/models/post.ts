import Mongoose, { Model, Schema, Types, Document, SchemaType } from "mongoose";
import { CommentDoc } from "./comment";
import { UserDoc } from "./user";

interface Post {
  content: string;
  timestamp: Date;
  user: Types.ObjectId | Map<String, any>;
  comments: (Types.ObjectId | Map<String, any>)[];
}

// for method
export interface PostDocBase extends Post, Document {}

export interface PostDoc extends PostDocBase {
  user: UserDoc["_id"];
  comments: CommentDoc["_id"][];
}

export interface PopulatedPostDoc {
  user: UserDoc;
  comments: CommentDoc[];
}

const postSchema = new Schema({
  content: {
    type: Schema.Types.String,
    required: true,
  },
  timestamp: {
    type: Schema.Types.Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
});

// define method here
export interface PostModel extends Model<PostDoc> {}

const PostDb = Mongoose.model<PostDoc, PostModel>("Post", postSchema);
export default PostDb;
