import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toast } from "react-toastify";
import getIcon from "../../icons";
import CustomModal from "../../components/modal";
import eventBus, { Events } from "../../services/eventBus.service";

export default function UserBio() {
  const userState = useSelector((state: RootState) => state.auth.user);
  const [preview, setPreview] = useState(userState.image);
  const [body, setBody] = useState(userState.body);
  const [raw, setRaw] = useState("");
  const [name, setName] = useState(userState.name);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const imageHandler = (e: any) => {
    setRaw(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const post = (e: Event) => {
    e.preventDefault();

    if (name.length === 0 || body.length === 0) {
      toast.error("Please fill the fields");
      return;
    }

    if (body.length > 255) {
      toast.error("Bio cannot be longer than 255chars");
      return;
    }

    const formData = new FormData();

    formData.append("photo", raw);
    formData.append("body", body);
    formData.append("name", name);
    formData.append("userId", userState.id);
    axios
      .post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/profile/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: "Bearer " + localStorage.getItem("loginauth"),
          },
        }
      )
      .then(() => {
        toast.success("Profile Updated.");
        setPreview("");
        setBody("");
        setRaw("");
        setName("");
        setShowProfileEdit(false);
        eventBus.emit(Events.PROFILE_UPDATED, "");
      })
      .catch((err) => {
        toast.error("Unable to update the profile.");
        console.log(err);
      });
  };

  return (
    <div>
      <CustomModal
        primaryButtonAction={(e) => post(e)}
        primaryButtonLabel="Save"
        title="Update Bio"
        isOpen={showProfileEdit}
        handleClose={() => setShowProfileEdit(false)}
      >
        <img
          src={
            preview
              ? `${import.meta.env.VITE_APP_BACKEND_URL}/uploads/biopics/` +
                preview
              : "https://nutristyle.com/wp-content/uploads/2020/06/bio-photo-placeholder.png"
          }
          className="img text-center mx-auto"
          height="200"
          width="200"
          alt="Selected"
        />
        <form className="form-group mt-4 mx-auto">
          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            type="file"
            id="file_input"
            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            accept=".jpg,.png,.jpeg"
            onChange={(e) => {
              imageHandler(e);
            }}
          />

          <label
            className="block mt-2 text-sm font-medium text-gray-900"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            required
            className="w-full mt-1 border-1 p-2 border-gray-300 rounded-md"
            placeholder="name"
            maxLength={99}
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            style={{ borderRadius: "0" }}
          />

          <label
            className="block mt-2 text-sm font-medium text-gray-900"
            htmlFor="desc"
          >
            Bio
          </label>
          <textarea
            id="desc"
            required
            rows={3}
            cols={8}
            className="w-full mt-1 border-1 p-2 border-gray-300 rounded-md"
            placeholder="Type here.."
            maxLength={255}
            onChange={(e) => {
              setBody(e.target.value);
            }}
            value={body}
            style={{ borderRadius: "0" }}
          />
        </form>
      </CustomModal>
      <div className="flex justify-end">
        <div
          onClick={() => {
            setShowProfileEdit(true);
          }}
          className="mr-1 w-4 text-left cursor-pointer"
        >
          {getIcon("EDIT")}
        </div>
      </div>
    </div>
  );
}
