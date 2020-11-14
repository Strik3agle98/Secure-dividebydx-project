import { CommonOptions } from "mongodb";
import Mongoose, { Model, Schema, Types, Document } from "mongoose";
import { PostDoc } from "./post";
import { UserDoc } from "./user";

export interface Comment {
  content: string;
  timestamp: Date;
  user: Types.ObjectId | Map<String, any>;
  post: Types.ObjectId | Map<String, any>;
}

// for method
export interface CommentDocBase extends Comment, Document {}

export interface CommentDoc extends CommentDocBase {
  user: UserDoc["_id"];
  post: PostDoc["_id"];
}

export interface PopulatedCommentDoc {
  user: UserDoc;
  post: PostDoc;
}

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  post: {
    type: Types.ObjectId,
    ref: "Post",
  },
});

// define method here
export interface CommentModel extends Model<CommentDoc> {}

const CommentDb = Mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);
export default CommentDb;
