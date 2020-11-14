import Mongoose, { Model, Schema, Types, Document, SchemaType } from "mongoose";
import { CommentDoc } from "./comment";
import { UserDoc } from "./user";

interface Post {
  content: string;
  timestamp: Date;
  user: Types.ObjectId | UserDoc;
  comments: (Types.ObjectId | CommentDoc)[];
}

// for method
export interface PostDocBase extends Post, Document {}

export interface PostDoc extends PostDocBase {
  user: UserDoc["_id"];
  comments: CommentDoc["_id"][];
}

export interface PopulatedPostDoc extends PostDocBase {
  user: UserDoc;
  comments: CommentDoc[];
}

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Comment",
  }],
});

// define method here
export interface PostModel extends Model<PostDoc> {}

const PostDb = Mongoose.model<PostDoc, PostModel>("Post", postSchema);
export default PostDb;
