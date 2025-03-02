import Appbar from "../../components/appbar";
import Posts from "../posts/getAllPosts";
import CreatePost from "../posts/createPost";

export default function Home() {
  return (
    <div className="max-h-full w-full overflow-hidden">
      <Appbar />
      <Posts />
      <CreatePost />
    </div>
  );
}
