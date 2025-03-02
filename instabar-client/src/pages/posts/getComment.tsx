import React from "react";
import { fetcher } from "../../services/fetcher";
import eventBus, { Events } from "../../services/eventBus.service";
import { timeAgo } from "../../utils/time";

export default function Comment({ postId }: { postId: string }) {
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetcher(`/post/getComments/` + postId, "GET")
      .then((res: any) => {
        setComments(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  React.useEffect(() => {
    const event = (payload: any) => {
      if (payload.postId !== postId) return;
      //@ts-ignore
      setComments((prev: any) => [payload.comment, ...prev]);
    };
    eventBus.on(Events.COMMENT_CREATED, event);
    return () => {
      eventBus.off(Events.COMMENT_CREATED, event);
    };
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="container w-full my-4"
      style={{ overflow: "auto", scrollbarWidth: "thin", maxHeight: "150px" }}
    >
      {comments.map((item: any, index) => (
        <div
          key={index}
          className="shadow-sm border-1 border-gray-200 my-2 p-2 w-full rounded-sm flex flex-col"
        >
          <div className="flex justify-between text-xs">
            <span>{item?.postedBy}</span>
            <span>{item?.createdAt && timeAgo(item.createdAt)}</span>
          </div>
          <span style={{ fontWeight: "500" }}>{item?.body}</span>
        </div>
      ))}
    </div>
  );
}
