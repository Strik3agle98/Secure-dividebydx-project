import React, { useState } from "react";
import { Input, Avatar, Comment, Popconfirm, Modal, message } from "antd";

const ColorList = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
  "#36688D",
  "#A7414A",
  "#583E2E",
  "#BE9063",
  "#132226",
  "#03353E",
  "#C1403D",
];

export default function CommentContent({
  children,
  username,
  content,
  canReply,
}) {
  const [showModalAddComment, setShowModalAddComment] = useState(false);
  const [showModalEditComment, setShowModalEditComment] = useState(false);
  const [randomColor, setRandomColor] = useState(
    ColorList[Math.floor(Math.random() * ColorList.length)]
  );

  const onAddCommentConfirm = (e) => {
    //TO DO Delete content
  };

  const onEditContentConfirm = (e) => {
    //TO DO Edit content
  };

  const onDeleteConfirm = (e) => {
    console.log(e);
    message.success("Delete content successful!");
    //TO DO Delete content
  };

  return (
    <Comment
      actions={[
        <>
          {canReply && (
            <span
              className="text-gray-500"
              onClick={() => setShowModalAddComment(true)}
            >
              Reply to
            </span>
          )}
        </>,
        <span
          className="text-gray-500"
          onClick={() => setShowModalEditComment(true)}
        >
          Edit
        </span>,
        <Popconfirm
          title="Are you sure delete this content?"
          onConfirm={onDeleteConfirm}
          okText="Yes"
          cancelText="No"
        >
          <span className="text-gray-500">Delete</span>
        </Popconfirm>,
      ]}
      author={<h4 className="text-lg">{username}</h4>}
      avatar={
        <Avatar
          style={{
            backgroundColor: randomColor,
          }}
          size="large"
        >
          {username[0]}
        </Avatar>
      }
      content={<p style={{ color: "rgba(255, 255, 255, 0.7)" }}>{content}</p>}
    >
      {children}

      <Modal
        title="ADD COMMENT"
        visible={showModalAddComment}
        onOk={onAddCommentConfirm}
        onCancel={() => setShowModalAddComment(false)}
        closable={false}
      >
        <Input size="large" placeholder="Add your comment to this post..." />
      </Modal>

      <Modal
        title="EDIT COMMENT"
        visible={showModalEditComment}
        onOk={onEditContentConfirm}
        onCancel={() => setShowModalEditComment(false)}
        closable={false}
      >
        <Input
          size="large"
          placeholder="Edit this post content..."
          defaultValue={content}
        />
      </Modal>
    </Comment>
  );
}
