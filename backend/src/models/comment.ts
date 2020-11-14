import { CommonOptions } from "mongodb";
import Mongoose, { Model, Schema, Types, Document } from "mongoose";
import { PostDoc } from "./post";
import { UserDoc } from "./user";

export interface Comment {
  content: string;
  timestamp: Date;
  user: Types.ObjectId | UserDoc;
  post: Types.ObjectId | PostDoc;
}

// for method
export interface CommentDocBase extends Comment, Document {}

export interface CommentDoc extends CommentDocBase {
  user: UserDoc["_id"];
  post: PostDoc["_id"];
}

export interface PopulatedCommentDoc extends CommentDocBase {
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
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
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
