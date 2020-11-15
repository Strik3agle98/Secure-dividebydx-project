import React, { useEffect, useState, Fragment } from "react";
import { Row, Col, Input, Divider } from "antd";
import { FontSizeOutlined } from "@ant-design/icons";
import SimpleBar from "simplebar-react";
import CommentContent from "../components/CommentContent";
import "simplebar/dist/simplebar.min.css";
import { postAPI, getPostAPI } from "../api";
import { externalEndpoint } from "../const";

const Post = ({ post, setPosts }) => {
  return (
    <Fragment>
      <CommentContent
        canReply={true}
        username={post.user.displayName}
        content={post.content}
        // onReply={}
        // onEdit={}
        // onDelete={}
      />
      {/* {post.comment.map((comment) => {
        return <CommentContent />;
      })} */}
      <Divider />
    </Fragment>
  );
};

const PostContent = () => {
  return (
    <SimpleBar style={{ maxHeight: 700 }}>
      <CommentContent
        canReply={true}
        username={"John Doe"}
        content={
          "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
        }
      >
        <CommentContent
          canReply={false}
          username={"John Doe"}
          content={
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
          }
        />
        <CommentContent
          canReply={false}
          username={"John Doe"}
          content={
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
          }
        />
      </CommentContent>
      <Divider />

      <CommentContent
        canReply={true}
        username={"John Doe"}
        content={
          "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
        }
      >
        <CommentContent
          canReply={false}
          username={"John Doe"}
          content={
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
          }
        />
        <CommentContent
          canReply={false}
          username={"John Doe"}
          content={
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
          }
        />
        <CommentContent
          canReply={false}
          username={"John Doe"}
          content={
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)."
          }
        />
      </CommentContent>
    </SimpleBar>
  );
};

export default ({ session }) => {
  const [posts, setPosts] = useState([]);
  const [create, setCreate] = useState({ content: "" });

  useEffect(() => {
    console.log(session);
    getPostAPI(externalEndpoint)(session.token).then((response) => {
      setPosts(response.data.posts);
      console.log(response.data.posts);
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
            VOS ESTIS "MODERATUR" (MODERATUR, USOR)
            <br />
            <br />
            I. You can "post and comment" on the platform
            <br />
            II. You can "edit" any posts
            <br />
            III. You can "delete" any posts
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

            {/* TO DO Post content handler */}
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
                        console.log(response.data.posts);
                      }
                    );
                  });
                // alert(create.content);
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
                return <Post post={post} setPosts={setPosts} />;
              })}
            </SimpleBar>
          </div>
        </div>
      </Col>
    </Row>
  );
};
