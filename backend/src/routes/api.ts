import express from "express";
import { User } from "../models/user";
import {
    AddCommentToPostUseCase,
    CreatePostUseCase,
    DeleteCommentUsecase,
    DeletePostUsecase,
    EditCommentUsecase,
    EditPostUsecase,
    GetAllPostsUseCase,
    GetPostByIdUseCase,
    GetPostCommentsUseCase,
    GetUserByIdUseCase,
    LoginUseCase,
    RegisterUseCase,
    SignJwtUseCase,
    ValidateCommentPermissionUseCase,
    ValidatePostPermissionUsecase,
    VerifyJwtUseCase,
} from "../usecase/usecases";

const rootRouter = express.Router();

const authMw = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !/^Bearer .+$/.test(authHeader)) {
        return res.status(401).send({ status: "Unauthorized" });
    }
    const token = authHeader.substring(7);
    try {
        const payload = VerifyJwtUseCase.execute(token);
        res.locals.user = payload;
        next();
    } catch (err) {
        return res.status(401).send({ status: "Invalid Token" });
    }
};

const postIdMw = (paramName: string) => (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const postId = req.params[paramName];
    if (!postId) return res.status(400).send({ status: "No post id" });
    res.locals.postId = postId;
    next();
};

const commentIdMw = (paramName: string) => (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const commentId = req.params[paramName];
    if (!commentId) return res.status(400).send({ status: "No comment id" });
    res.locals.commentId = commentId;
    next();
};

const checkPostMw = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const { postId, user: { userId } } = res.locals;
    try {
        const ok = await ValidatePostPermissionUsecase.execute(postId, userId);
        if (!ok)
            throw new Error(`Forbidden access user ${userId} post ${postId}`);
        next();
    } catch (err) {
        console.error("postIdMiddleware", err);
        return res.status(403).send({ status: "Forbidden or not found" });
    }
};

const checkCommentMw = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const { commentId, user: { userId } } = res.locals;
    try {
        const ok = await ValidateCommentPermissionUseCase.execute(commentId, userId);
        if (!ok)
            throw new Error(`Forbidden access user ${userId} comment ${commentId}`);
        next();
    } catch (err) {
        console.error("commentIdMiddleware", err);
        return res.status(403).send({ status: "Forbidden or not found" });
    }
};

// Please use SINGULAR path name
rootRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await LoginUseCase.execute(username, password);
        const jwt = SignJwtUseCase.execute(user);
        return res.status(200).send({ token: jwt });
    } catch (err) {
        console.error("Invalid login attempt", { username, password });
        return res.status(401).send({ status: "Invalid username/password" });
    }
});

rootRouter.post("/dev/register", async (req, res) => {
    const { username, password, displayName, role } = req.body;
    try {
        if (
            !username ||
            !password ||
            !displayName ||
            (role !== "admin" && role !== "user")
        )
            return res.status(400).send({ status: "Bad request" });

        const newUser: User = {
            username,
            password,
            displayName,
            role,
        };

        const user = await RegisterUseCase.execute(newUser);
        return res.status(200).send({ status: "OK" });
    } catch (err) {
        console.error("Error creating", err);
        return res.status(500).send({ status: "Error" });
    }
});

rootRouter.get("/user/:userId", authMw, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await GetUserByIdUseCase.execute(userId);


        return res.status(200).send({ user: user });
    } catch (err) {
        console.error("Error creating", err);
        return res.status(500).send({ status: "Error" });
    }
});

// post
rootRouter.get("/post", authMw, async (req, res) => {
    const posts = await GetAllPostsUseCase.execute();
    return res.status(200).send({ posts });
});

rootRouter.get("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await GetPostByIdUseCase.execute(postId);
        return res.status(200).send({ post });
    } catch (err) {
        return res.status(404).send({ status: "Not found" });
    }
});

rootRouter.post("/post", authMw, async (req, res) => {
    const { user: { userId } } = res.locals;
    const { content } = req.body;
    console.log({ userId, content });
    if (!content) return res.status(400).send({ status: "No content specified" });
    const post = await CreatePostUseCase.execute(content, userId);
    return res.status(200).send({ post });
});

rootRouter.post(
    "/post/:postId",
    authMw,
    postIdMw("postId"),
    checkPostMw,
    async (req, res) => {
        const { postId } = res.locals;
        const { content } = req.body;
        if (!content)
            return res.status(400).send({ status: "No content specified" });
        await EditPostUsecase.execute(postId, content);
        return res.status(200).send({ status: "OK" });
    }
);

rootRouter.delete(
    "/post/:postId",
    authMw,
    postIdMw("postId"),
    checkPostMw,
    async (req, res) => {
        const { postId } = res.locals;
        await DeletePostUsecase.execute(postId);
        return res.status(200).send({ status: "OK" });
    }
);

// comment to post

rootRouter.get(
    "/post/:postId/comment",
    authMw,
    postIdMw("postId"),
    async (req, res) => {
        const { postId } = res.locals;
        const comments = await GetPostCommentsUseCase.execute(postId);
        return res.status(200).send({ comments });
    }
);

rootRouter.post(
    "/post/:postId/comment",
    authMw,
    postIdMw("postId"),
    async (req, res) => {
        const { content } = req.body;
        const { postId, user: { userId } } = res.locals;
        if (!content) return res.status(400).send({status: "No content specified"});

        const comment = await AddCommentToPostUseCase.execute(
            postId,
            userId,
            content
        );
        return res.status(200).send({ comment });
    }
);

// edit / delete comment

rootRouter.post(
    "/comment/:commentId",
    authMw,
    commentIdMw("commentId"),
    checkCommentMw,
    async (req, res) => {
        const { content } = req.body;
        const { commentId } = res.locals;
        if (!content)
            return res.status(400).send({ status: "No content specified" });
        await EditCommentUsecase.execute(commentId, content);
        return res.status(200).send({ status: "OK" });
    }
);

rootRouter.delete(
    "/comment/:commentId",
    authMw,
    commentIdMw("commentId"),
    checkCommentMw,
    async (req, res) => {
        const { commentId } = res.locals;
        await DeleteCommentUsecase.execute(commentId);
        return res.status(200).send({ status: "OK" });
    }
);

export default rootRouter;
