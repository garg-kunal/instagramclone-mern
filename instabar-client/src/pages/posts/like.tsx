import { useState } from "react";
import { useSelector } from "react-redux";
import { fetcher } from "../../services/fetcher";
import { RootState } from "../../store/index";
import getIcon from "../../icons";

function Like({
  postId,
  isLikedByUser,
  likesCount,
}: {
  postId: string;
  isLikedByUser: boolean;
  likesCount: number;
}) {
  const authState = useSelector((state: RootState) => state.auth);

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [count, setCount] = useState(likesCount);

  // useEffect(() => {
  //   const data = {
  //     me: authState.user.id,
  //     postId,
  //   };

  //   fetcher("/post/getlike/", "POST", data)
  //     .then((res: any) => {
  //       setIsLiked(res.data.isLikedByUser);
  //       setCount(res.data.message);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const unlikePost = () => {
    const data = {
      me: authState.user.id,
      postId,
    };

    fetcher("/post/unlike", "POST", data)
      .then((res: any) => {
        setIsLiked(false);
        setCount(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likePost = () => {
    const data = {
      me: authState.user.id,
      postId,
    };

    fetcher("/post/like", "PUT", data)
      .then((res: any) => {
        setIsLiked(true);
        setCount(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <div
        style={{
          color: isLiked ? "red" : "black",
          cursor: "pointer",
        }}
        onClick={() => {
          isLiked ? unlikePost() : likePost();
        }}
      >
        {getIcon("HEART")}
      </div>
      <span> {count}</span>
    </div>
  );
}

export default Like;
