import UserPosts from "../posts/userPosts";
import Appbar from "../../components/appbar";
import ShowProfile from "./showProfile";

export default function UserProfile() {
  return (
    <div className="flex flex-col gap-2 scrollbar-thin">
      <Appbar />
      <ShowProfile />
      <UserPosts />
    </div>
  );
}
