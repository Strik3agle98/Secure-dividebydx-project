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
  onReply,
  onDelete,
  onEdit,
  isAdmin,
}) {
  const [showModalAddComment, setShowModalAddComment] = useState(false);
  const [showModalEditComment, setShowModalEditComment] = useState(false);
  const [comment, setComment] = useState({ content: "" });
  const [edit, setEdit] = useState({ content: "" });
  const [randomColor, setRandomColor] = useState(
    ColorList[Math.floor(Math.random() * ColorList.length)]
  );

  return (
    <Comment
      actions={
        isAdmin
          ? [
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
                onConfirm={onDelete}
                okText="Yes"
                cancelText="No"
              >
                <span className="text-gray-500">Delete</span>
              </Popconfirm>,
            ]
          : [
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
            ]
      }
      author={<h4 className="text-lg">{username}</h4>}
      avatar={
        <Avatar
          style={{
            backgroundColor: randomColor,
          }}
          size="large"
        >
          {username ? username[0] : "N"}
        </Avatar>
      }
      content={<p style={{ color: "rgba(255, 255, 255, 0.7)" }}>{content}</p>}
    >
      {children}

      <Modal
        title="ADD COMMENT"
        visible={showModalAddComment}
        onOk={onReply(comment, setShowModalAddComment)}
        onCancel={() => setShowModalAddComment(false)}
        closable={false}
      >
        <Input
          value={comment.content}
          onChange={(e) => {
            setComment({ content: e.target.value });
          }}
          size="large"
          placeholder="Add your comment to this post..."
        />
      </Modal>

      <Modal
        title="EDIT COMMENT"
        visible={showModalEditComment}
        onOk={onEdit(edit, setShowModalEditComment)}
        onCancel={() => setShowModalEditComment(false)}
        closable={false}
      >
        <Input
          value={edit.content}
          onChange={(e) => {
            setEdit({ content: e.target.value });
          }}
          size="large"
          placeholder="Edit this post content..."
          defaultValue={content}
        />
      </Modal>
    </Comment>
  );
}
