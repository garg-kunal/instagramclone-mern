import React from "react";
import { useSelector } from "react-redux";
import { fetcher } from "../../services/fetcher";
import { RootState } from "../../store";
import { toast } from "react-toastify";
import getIcon from "../../icons";
import eventBus, { Events } from "../../services/eventBus.service";

export default function CreateComment({ postId }: { postId: string }) {
  const authState = useSelector((state: RootState) => state.auth);

  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const post = () => {
    setLoading(true);

    const data = {
      comment,
      me: authState.user.name,
      postId: postId,
    };
    fetcher(`/post/createComment/`, "POST", data)
      .then((res: any) => {
        setComment("");
        toast.success("Comment Posted!");
        eventBus.emit(Events.COMMENT_CREATED, {
          postId,
          comment: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container-fluid bg-light mb-2">
      <div className="text-center">
        <form className="flex flex-row gap-2 items-center">
          <input
            type="text"
            required
            placeholder="Comment here..."
            disabled={loading}
            className="border-1 w-full rounded-sm p-2"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
          <div
            onClick={() => {
              post();
            }}
            className="cursor-pointer"
          >
            {getIcon("SEND")}
          </div>
        </form>
      </div>
    </div>
  );
}
