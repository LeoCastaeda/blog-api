import React from "react";
import { useParams } from "react-router-dom";
import PostDetails from "../components/Posts/PostDetails";

const PostDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id, 10) : undefined;

  return (
    <div>
      {postId !== undefined && <PostDetails postId={postId} />}
    </div>
  );
};

export default PostDetailsPage;
