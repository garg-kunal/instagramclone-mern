import { useEffect, useState } from "react";
import { fetcher } from "../../services/fetcher";
import { Backdrop, CircularProgress } from "@mui/material";
import PostCard, { PostType } from "./post";
import eventBus, { Events } from "../../services/eventBus.service";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

function UserPosts() {
  const [link, setlink] = useState([]);
  const [loader, setloader] = useState(true);
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetcher(`/post/postsByUserId/` + authState.user.id, "GET")
      .then((res: any) => {
        setlink(res.data.data);
      })
      .catch((err: Error) => {
        console.log(err);
      })
      .finally(() => {
        setloader(false);
      });
  }, []);

  useEffect(() => {
    const event = (deletedPostId: string) => {
      setlink((prev: any) =>
        prev.filter((item: any) => item._id !== deletedPostId)
      );
    };
    eventBus.on(Events.POST_DELETED, event);
    return () => {
      eventBus.off(Events.POST_DELETED, event);
    };
  }, []);

  if (loader) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className="w-full my-4 py-4">
      <div className="text-lg mt-4 mb-2 font-bold mx-auto text-center underline">
        Your Posts
      </div>
      {link.map((item: PostType) => (
        <PostCard
          key={item._id}
          _id={item._id}
          userName={item.userName}
          userId={item.userId}
          userImage={item.userImage}
          createdAt={item.createdAt}
          photo={item.photo}
          body={item.body}
          commentsCount={item.commentsCount}
          isLikedByUser={item.isLikedByUser}
          likesCount={item.likesCount}
        />
      ))}
    </div>
  );
}
export default UserPosts;
