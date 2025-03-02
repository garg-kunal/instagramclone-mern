import { useSelector } from "react-redux";
import Add from "./updateProfile";
import { RootState } from "../../store";

export default function UserProfile() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="w-full">
      <div className="w-[60%] border-1 border-gray-200 h-auto my-4 p-4 rounded-lg mx-auto shadow-lg">
        <Add />
        <div className="flex flex-row gap-8 p-4 items-center">
          <div className="flex-[0.4] sm:flex-1">
            <img
              src={
                user?.image
                  ? `${import.meta.env.VITE_APP_BACKEND_URL}/uploads/biopics/` +
                    user?.image
                  : "https://nutristyle.com/wp-content/uploads/2020/06/bio-photo-placeholder.png"
              }
              id="userimage"
              alt="User Pic"
              className="rounded-full mx-auto w-48 h-48"
            />
          </div>
          <div className="flex-[0.6] sm:flex-1 mx-auto">
            <div className="card-header font-bold">{user.name}</div>
            <span className="text-xs">{user.body}</span>
            <div className="flex w-full justify-between gap-2">
              <div className="flex flex-col gap-1 text-center my-2">
                <span className="text-sm font-bold">{user.postCount}</span>
                <span className="text-sm">posts</span>
              </div>
              <div className="flex flex-col gap-1 text-center my-2">
                <span className="text-sm font-bold">
                  {user.followers.length}
                </span>
                <span className="text-sm">followers</span>
              </div>
              <div className="flex flex-col text-center gap-1 my-2">
                <span className="text-sm font-bold">{user.follow.length}</span>
                <span className="text-sm">following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
