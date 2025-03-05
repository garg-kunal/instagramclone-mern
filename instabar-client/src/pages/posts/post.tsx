import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import getIcon from "../../icons";
import Like from "./like";
import GetComments from "./getComment";
import CreateComment from "./createComment";
import { timeAgo } from "../../utils/time";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { fetcher } from "../../services/fetcher";
import { toast } from "react-toastify";
import eventBus, { Events } from "../../services/eventBus.service";
import CustomModal from "../../components/modal";

// interface ExpandMoreProps extends IconButtonProps {
//   expand: boolean;
// }

// const ExpandMore = styled((props: ExpandMoreProps) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: "auto",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
//   variants: [
//     {
//       props: ({ expand }) => !expand,
//       style: {
//         transform: "rotate(0deg)",
//       },
//     },
//     {
//       props: ({ expand }) => !!expand,
//       style: {
//         transform: "rotate(180deg)",
//       },
//     },
//   ],
// }));

export type PostType = {
  _id: string;
  userName: string;
  userId: string;
  userImage: string;
  createdAt: string;
  photo: string;
  body: string;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
};

export default function PostCard(props: PostType) {
  const [expanded, setExpanded] = React.useState(false);
  const userState = useSelector((state: RootState) => state.auth.user);
  const [showDeletePost, setShowDeletePost] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const deletePost = (id: string) => {
    fetcher(`/post/delete/` + id, "GET")
      .then(() => {
        setShowDeletePost(false);
        toast.success("Post Deleted!");
        eventBus.emit(Events.POST_DELETED, id);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <CustomModal
        title="Delete Post"
        primaryButtonLabel="Delete"
        isOpen={showDeletePost}
        handleClose={() => setShowDeletePost(false)}
        primaryButtonAction={() => deletePost(props._id)}
      >
        <div className="text-sm">
          Are you sure? You want to delete this post?
        </div>
      </CustomModal>
      <Card sx={{ maxWidth: 360, boxShadow: 3, margin: "8px auto" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500] }}
              aria-label="user-name"
              src={
                props.userImage ||
                "https://nutristyle.com/wp-content/uploads/2020/06/bio-photo-placeholder.png"
              }
            >
              {props?.userName?.[0]}
            </Avatar>
          }
          action={
            userState.id === props.userId && (
              <IconButton
                onClick={() => setShowDeletePost(true)}
                aria-label="settings"
              >
                {getIcon("DELETE")}
              </IconButton>
            )
          }
          title={props?.userName}
          subheader={timeAgo(props.createdAt)}
        />
        <CardMedia
          component="img"
          height="194"
          image={props.photo || "https://placehold.co/600x400"}
          alt="Post Image"
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {props.body}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Like
            postId={props._id}
            isLikedByUser={props.isLikedByUser || false}
            likesCount={props.likesCount || 0}
          />
          <div className="flex flex-row gap-2 items-center">
            <div className="cursor-pointer ml-2" onClick={handleExpandClick}>
              {getIcon("COMMENT")}
            </div>
            <span> {props.commentsCount}</span>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <CreateComment postId={props._id} />
            <GetComments postId={props._id} />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}
