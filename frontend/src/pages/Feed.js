import React, { useEffect, useState, Fragment } from "react";
import { Row, Col, Input, Divider } from "antd";
import { FontSizeOutlined } from "@ant-design/icons";
import SimpleBar from "simplebar-react";
import CommentContent from "../components/CommentContent";
import "simplebar/dist/simplebar.min.css";
import {
  postAPI,
  getPostAPI,
  commentAPI,
  deleteAPI,
  editAPI,
  getCommentAPI,
  editCommentAPI,
  deleteCommentAPI,
} from "../api";
import { externalEndpoint } from "../const";

const Post = ({ post, setPosts, session }) => {
  const [comments, setComments] = useState([]);
  const onReply = (content, setShowModalAddComment) => (e) => {
    commentAPI(externalEndpoint)(post._id)(content)(session.token).then(() => {
      getPostAPI(externalEndpoint)(session.token).then((response) => {
        setPosts(response.data.posts);
        setShowModalAddComment(false);
      });
    });
  };

  const onDelete = (e) => {
    deleteAPI(externalEndpoint)(post._id)(session.token).then(() => {
      getPostAPI(externalEndpoint)(session.token).then((response) => {
        setPosts(response.data.posts);
      });
    });
  };

  const onDeleteComment = (id) => (e) => {
    deleteCommentAPI(externalEndpoint)(id)(session.token).then(() => {
      getPostAPI(externalEndpoint)(session.token).then((response) => {
        setPosts(response.data.posts);
      });
    });
  };

  const onEdit = (content, setShowModalEditComment) => (e) => {
    editAPI(externalEndpoint)(post._id)(content)(session.token).then(() => {
      getPostAPI(externalEndpoint)(session.token).then((response) => {
        setPosts(response.data.posts);
        setShowModalEditComment(false);
      });
    });
  };

  const onEditComment = (id) => (content, setShowModalEditComment) => (e) => {
    editCommentAPI(externalEndpoint)(id)(content)(session.token).then(() => {
      getPostAPI(externalEndpoint)(session.token).then((response) => {
        setPosts(response.data.posts);
        setShowModalEditComment(false);
      });
    });
  };

  useEffect(() => {
    getCommentAPI(externalEndpoint)(post._id)(session.token).then(
      (response) => {
        setComments(response.data.comments);
      }
    );
  }, [post]);

  return (
    <Fragment>
      <CommentContent
        isAdmin={
          session.user.role === "admin" || session.user._id === post.user._id
        }
        canReply={true}
        username={post.user.displayName}
        content={post.content}
        onReply={onReply}
        onDelete={onDelete}
        onEdit={onEdit}
      >
        {comments.length !== 0 &&
          comments.map((comment) => {
            return (
              <CommentContent
                key={comment._id}
                isAdmin={
                  session.user.role === "admin" ||
                  session.user._id === comment.user._id
                }
                canReply={false}
                username={comment.user.displayName}
                content={comment.content}
                onReply={onReply}
                onDelete={onDeleteComment(comment._id)}
                onEdit={onEditComment(comment._id)}
              />
            );
          })}
      </CommentContent>
      <Divider />
    </Fragment>
  );
};

export default ({ session }) => {
  const [posts, setPosts] = useState([]);
  const [create, setCreate] = useState({ content: "" });

  useEffect(() => {
    getPostAPI(externalEndpoint)(session.token).then((response) => {
      setPosts(response.data.posts);
    });
  }, []);

  return (
    <Row className="h-full">
      <Col span={8} className="h-full flex flex-row items-center">
        <div className="mx-16">
          <h1 id="logo" className="text-5xl mb-16">
            POSTBOOK.md
          </h1>
          <p>
            You are {session.user.role} {session.user.displayName}
            <br />
            <br />
            I. You can "post and comment" on the platform
            <br />
            II. You can "edit" {session.user.role === "user"
              ? "your"
              : "every"}{" "}
            posts
            <br />
            III. You can "delete"{" "}
            {session.user.role === "user" ? "your" : "every"} posts
            <br />
            <br />© 2020 omne ius per Bankbiz disposito
          </p>
        </div>
      </Col>
      <Col span={16} className="h-full flex flex-row items-center pr-64">
        <div className="w-full flex flex-col">
          <div className="postbook-frame px-16 pb-12 w-full mb-16">
            <h2
              className="text-xl px-2 mb-12"
              style={{
                position: "relative",
                top: "-16px",
                left: "-8px",
                background: "#141414",
                width: "fit-content",
              }}
            >
              POST SCRIBERE
            </h2>

            <Input
              value={create.content}
              onChange={(e) => {
                setCreate({ content: e.target.value });
              }}
              onPressEnter={(e) => {
                create &&
                  postAPI(externalEndpoint)(create)(session.token).then(() => {
                    getPostAPI(externalEndpoint)(session.token).then(
                      (response) => {
                        setPosts(response.data.posts);
                      }
                    );
                  });
              }}
              size="large"
              placeholder="Quid autem vobis videtur?"
              prefix={<FontSizeOutlined />}
              className="mb-3"
            />
            <div style={{ color: "rgb(255 255 255 / 40%)" }}>
              <p className="mr-auto">
                after you done, hit enter to post to the feed
              </p>
            </div>
          </div>
          <div className="postbook-frame px-16 pb-12 w-full">
            <h2
              className="text-xl px-2 mb-12"
              style={{
                position: "relative",
                top: "-16px",
                left: "-8px",
                background: "#141414",
                width: "fit-content",
              }}
            >
              RESTINCTIO
            </h2>
            <SimpleBar style={{ maxHeight: 700 }}>
              {posts.map((post) => {
                return (
                  <Post
                    key={post._id}
                    post={post}
                    setPosts={setPosts}
                    session={session}
                  />
                );
              })}
            </SimpleBar>
          </div>
        </div>
      </Col>
    </Row>
  );
};
