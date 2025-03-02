import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Fab from "@mui/material/Fab";
import CustomModal from "../../components/modal";
import { RootState } from "../../store";
import { toast } from "react-toastify";
import getIcon from "../../icons";
import eventBus, { Events } from "../../services/eventBus.service";

export default function CreatePost() {
  const authState = useSelector((state: RootState) => state.auth);

  const [raw, setRaw] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPosting, setIsPost] = React.useState(false);

  const imageHandler = (e: any) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setRaw(e.target.files[0]);
  };

  const post = () => {
    if (status.length === 0 || raw === "") {
      toast.error("Please fill these fields....");
      return;
    }

    if (raw === "") {
      toast.error("Please select an image....");
      return;
    }

    const formData = new FormData();
    formData.append("photo", raw);
    formData.append("body", status);
    formData.append("userName", authState.user.name);
    formData.append("userId", authState.user.id);
    formData.append("userImage", authState.user.image);

    setIsPost(true);
    axios
      .post(`${import.meta.env.VITE_APP_BACKEND_URL}/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + localStorage.getItem("loginauth"),
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        setRaw("");
        setPreview("");
        setStatus("");
        setIsOpen(false);
        eventBus.emit(Events.POST_CREATED, res.data.post);
      })
      .catch((err) => {
        toast.error("Unable to Post....");
        console.error(err);
      })
      .finally(() => {
        setIsPost(false);
      });
  };

  return (
    <div className="position-relative w-full">
      <Fab
        sx={{
          position: "absolute",
          right: "8px",
          bottom: "8px",
          backgroundColor: "#000",
          color: "#fff",
          zIndex: 555,
          "&:hover": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {getIcon("ADD")}
      </Fab>
      <CustomModal
        isOpen={isOpen}
        title="Create Post"
        primaryButtonAction={() => {
          post();
        }}
        disabledAllActions={isPosting}
        primaryButtonLabel="Create"
        handleClose={() => {
          setIsOpen(false);
        }}
      >
        <>
          {preview && (
            <img
              src={preview}
              className="img img-thumbnail mb-2 mx-auto"
              height="300"
              width="300"
              alt="Selected"
            />
          )}
          <label
            className="block mb-2 text-sm font-medium text-gray-900"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            type="file"
            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            accept=".jpg,.png,.jpeg"
            disabled={isPosting}
            aria-describedby="file_input_help"
            id="file_input"
            onChange={(e) => {
              imageHandler(e);
            }}
          />
          <p className="mt-1 text-sm text-gray-500 " id="file_input_help">
            PNG, JPG.
          </p>

          <label
            className="block mt-2 text-sm font-medium text-gray-900"
            htmlFor="desc"
          >
            Description
          </label>
          <textarea
            id="desc"
            required
            rows={3}
            cols={8}
            className="w-full mt-1 border-1 p-2 border-gray-300 rounded-md"
            disabled={isPosting}
            placeholder="Type here.."
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            value={status}
            style={{ borderRadius: "0" }}
          />
        </>
      </CustomModal>
    </div>
  );
}
