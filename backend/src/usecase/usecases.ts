import { JsonWebTokenError } from "jsonwebtoken";
import UserDb, { User, UserDoc, UserModel } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";
import PostDb, { PopulatedPostDoc, PostDoc, Post } from "../models/post";
import Mongoose, { Types } from "mongoose";
import CommentDb, { CommentDoc, Comment, PopulatedCommentDoc } from "../models/comment";
import { hash } from "bcrypt";
// Auth
export class LoginUseCase {
  static async execute(username: string, password: string): Promise<UserDoc> {
    const user = await UserDb.findByUsernameAndPassword(username, password);
    if (!user) throw new Error("User found");
    return user;
  }
}

export class SignJwtUseCase {
  static execute(user: UserDoc): string {
    return jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: 3600 * 1000 }
    );
  }
}

interface JwtResult {
  userId: string;
  role: "admin" | "user";
}

export class VerifyJwtUseCase {
  static execute(token: string): JwtResult {
    const result = jwt.verify(token, config.JWT_SECRET);
    const { userId, role } = result as any;
    if (!userId || !role) throw new Error("Invalid JWT");
    return { userId, role };
  }
}

export class RegisterUseCase {
  static async execute(user: User): Promise<void> {
    // TODO: actually this should validate ?
    user.password = await hash(user.password, 8);
    await UserDb.insertMany(user);
    return;
  }
}
// User
export class GetUserByIdUseCase {
  static async execute(userId: string): Promise<UserDoc> {
    const user = await UserDb.findOne({_id: userId}, {password: 0});
    if (!user) throw new Error("User not found");

    return user.toObject();
  }
}

// Post
export class GetPostByIdUseCase {
  static async execute(postId: string): Promise<PopulatedPostDoc | undefined> {
    const result = (await PostDb.findById(postId).populate('user').populate('comments'));
    return result ?? undefined;
  }
}

export class GetAllPostsUseCase {
  static async execute() {
    return await PostDb.find().populate('user').populate('comments');
  }
}

export class CreatePostUseCase {
  static async execute(content: string, userId: string): Promise<PopulatedPostDoc> {
    const newPost: Post = {
      content,
      user: new Mongoose.Types.ObjectId(userId),
      timestamp: new Date(),
      comments: [],
    };
    const post = (await PostDb.insertMany([newPost]))[0];
    return await post.populate('user').populate('comments');
  }
}

export class EditPostUsecase {
  static async execute(postId: string, newContent: string): Promise<void> {
    const oldPost = await PostDb.findById(postId);
    if (!oldPost) throw new Error("Post not found");
    oldPost.content = newContent;
    oldPost.timestamp = new Date();
    await oldPost.save();
  }
}

export class DeletePostUsecase {
  static async execute(postId: string): Promise<number> {
    const post = await PostDb.deleteOne({ _id: postId });
    return post.deletedCount ?? 0;
  }
}

export class ValidatePostPermissionUsecase {
  static async execute(postId: string, userId: string) {
    const post = await PostDb.findById(postId);
    if (!post) throw new Error("invalid Post");
    console.log("[validate.post]", post._id);
    // same user = ok
    if (post.user.toString() == userId) return true;
    // else check admin
    const user = await UserDb.findById(userId);
    if (!user) throw new Error("invalid User");
    console.log("[validate.user]", user._id, user.role);
    console.log("result", user.role === 'admin')
    return user.role === "admin";
  }
}

// comment
export class GetPostCommentsUseCase {
  static async execute(postId: string): Promise<PopulatedCommentDoc[]> {
    const comments = await CommentDb.find({ post: postId }).populate('user');
    return comments;
  }
}

export class AddCommentToPostUseCase {
  static async execute(
    postId: string,
    userId: string,
    content: string
  ): Promise<CommentDoc> {
    const post = await PostDb.findById(postId);
    if (!post) throw new Error("Post not found");

    const newComment: Partial<Comment> = {
      post: new Mongoose.Types.ObjectId(postId),
      user: new Mongoose.Types.ObjectId(userId),
      content,
      timestamp: new Date(),
    };
    const commentDoc = (await CommentDb.insertMany([newComment]))[0];

    post.comments.push(commentDoc._id);
    await post.save();

    return commentDoc;
  }
}

export class EditCommentUsecase {
  static async execute(commentId: string, newContent: string): Promise<void> {
    const oldComment = await CommentDb.findById(commentId);
    if (!oldComment) throw new Error("Comment not found");
    oldComment.content = newContent;
    // dont update time cause dont wanna break comment order
    await oldComment.save();
  }
}
export class DeleteCommentUsecase {
  static async execute(commentId: string): Promise<number> {
    const deletedComment = await CommentDb.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return 0;
    }

    const post = (await PostDb.findById(deletedComment.post)) as PostDoc;
    console.log("comments", post.comments);

    const idx = post.comments.findIndex((cid) => cid === commentId);
    if (!idx) throw new Error("Inconsistency found in DB");
    const newComments = [...post.comments];
    newComments.splice(idx, 1);
    post.comments = newComments;

    await post.save();
    return 1;
  }
}

export class ValidateCommentPermissionUseCase {
  static async execute(commentId: string, userId: string) {
    console.log({commentId, userId})
    const comment = await CommentDb.findById(commentId);
    if (!comment) throw new Error("invalid Comment");
    // same user = ok
    if (comment.user.toString() == userId) return true;
    // else check admin
    const user = await UserDb.findById(userId);
    if (!user) throw new Error("invalid User");
    return user.role === "admin";
  }
}
