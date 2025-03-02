import { useEffect, useState } from "react";
import { fetcher } from "../../services/fetcher";
import { Backdrop, CircularProgress, Pagination } from "@mui/material";
import PostCard, { PostType } from "./post";
import eventBus, { Events } from "../../services/eventBus.service";
import { useSearchParams } from "react-router";

function Posts() {
  const [searchParams] = useSearchParams();
  const [loader, setloader] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const limit = 10;
  const [postsData, setPostsData] = useState({
    totalPages: 1,
    totalPosts: 10,
    currentPage: searchParams.get("page"),
    data: [],
  });

  useEffect(() => {
    fetcher(`/post/get?page=${pageNo}&limit=${limit}`, "GET")
      .then((res: any) => {
        setPostsData({ ...res?.data });
      })
      .catch((err: Error) => {
        console.log(err);
      })
      .finally(() => {
        setloader(false);
      });
  }, [pageNo]);

  useEffect(() => {
    const event = (newPost: PostType) => {
      //@ts-ignore
      setPostsData((prev) => ({
        ...prev,
        data: [newPost, ...prev.data],
      }));
    };
    eventBus.on(Events.POST_CREATED, event);
    return () => {
      eventBus.off(Events.POST_CREATED, event);
    };
  }, []);

  useEffect(() => {
    const event = (delPostId: string) => {
      setPostsData((prev) => ({
        ...prev,
        data: prev.data.filter((post: PostType) => post._id !== delPostId),
      }));
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
    <div className="w-full overflow-auto max-h-full my-4 py-4">
      {postsData.data.map((post: PostType) => (
        <PostCard
          key={post._id}
          _id={post._id}
          userName={post.userName}
          userId={post.userId}
          userImage={post.userImage}
          createdAt={post.createdAt}
          photo={post.photo}
          body={post.body}
          isLikedByUser={post.isLikedByUser}
          commentsCount={post.commentsCount}
          likesCount={post.likesCount}
        />
      ))}
      <div className="flex mt-4 flex-row justify-between">
        <span className="flex-[0.4]"></span>
        <Pagination
          page={pageNo}
          className="flex-[0.2]"
          count={Math.ceil(postsData.totalPosts / limit)}
          onChange={(_, pageNumber) => {
            setPageNo(pageNumber);
            window.history.pushState({}, "", `?page=${pageNumber}`);
          }}
        />
        <span className="flex-[0.4]"></span>
      </div>
    </div>
  );
}
export default Posts;
