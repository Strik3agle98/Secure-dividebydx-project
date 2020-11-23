import express from 'express';
import { ValidateCommentPermissionUseCase, ValidatePostPermissionUsecase, VerifyJwtUseCase } from '../usecase/usecases';

export const authMw = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !/^Bearer .+$/.test(authHeader)) {
    return res.status(401).send({ status: 'Unauthorized' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = VerifyJwtUseCase.execute(token);
    res.locals.user = payload;
    next();
  } catch (err) {
    return res.status(401).send({ status: 'Invalid Token' });
  }
};

export const postIdMw = (paramName: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const postId = req.params[paramName];
  if (!postId) return res.status(400).send({ status: 'No post id' });
  res.locals.postId = postId;
  next();
};

export const commentIdMw = (paramName: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const commentId = req.params[paramName];
  if (!commentId) return res.status(400).send({ status: 'No comment id' });
  res.locals.commentId = commentId;
  next();
};

export const checkPostMw = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    postId,
    user: { userId },
  } = res.locals;
  try {
    const ok = await ValidatePostPermissionUsecase.execute(postId, userId);
    if (!ok) throw new Error(`Forbidden access user ${userId} post ${postId}`);
    next();
  } catch (err) {
    console.error('postIdMiddleware', err);
    return res.status(403).send({ status: 'Forbidden or not found' });
  }
};

export const checkCommentMw = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    commentId,
    user: { userId },
  } = res.locals;
  try {
    const ok = await ValidateCommentPermissionUseCase.execute(commentId, userId);
    if (!ok) throw new Error(`Forbidden access user ${userId} comment ${commentId}`);
    next();
  } catch (err) {
    console.error('commentIdMiddleware', err);
    return res.status(403).send({ status: 'Forbidden or not found' });
  }
};
