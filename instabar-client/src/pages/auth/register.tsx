import { useEffect, useState } from "react";
import { fetcher } from "../../services/fetcher";
import Guests from "../../assets/edit.png";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router";
import { RootState } from "../../store";

export default function Login() {
  const [email, setEmail] = useState("abc12346@test.com");
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState(
    `Test User - ${Math.floor(Math.random() * 1000)}`
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/home");
      return;
    }
  }, [authState.isAuthenticated]);

  const post = () => {
    if (email.length === 0 || password.length === 0 || name.length === 0) {
      toast.error("Please fill the fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password too short");
      return;
    }

    const data = {
      email,
      password,
      name,
    };

    setLoading(true);

    fetcher(`/user/register`, "POST", data)
      .then((res: any) => {
        if (res.data.code === "registered") {
          navigate("/login");
        }
      })
      .catch((err: Error) => {
        setMessage(err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-96 mt-8 pb-8 text-center mx-auto border-2 border-gray-200 p-4 rounded-md shadow-lg">
      <div className="text-center">
        <img src={Guests} alt="user" className="img img-fluid mx-auto" />
      </div>
      <div className="text-center">
        <div className="my-2">
          <b className="text-center text-red-500">{message}</b>
        </div>
        <div className="text-center text-lg">Sign Up</div>
        <form>
          <div className="flex flex-col">
            <div className="mt-2">
              <label
                htmlFor="name"
                className="block text-left text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                placeholder="Name"
                value={name}
                disabled={loading}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="email"
                className="block text-left text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                placeholder="Email"
                disabled={loading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="password"
                className="block text-sm text-left font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                disabled={loading}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div
            onClick={post}
            className={`${
              loading && "bg-gray-400 cursor-not-allowed"
            } text-white cursor-pointer w-full mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm sm:w-auto px-5 py-2.5 text-center`}
          >
            Submit
          </div>
        </form>
        <div className="flex mt-2">
          <NavLink to="/login" className="mx-auto underline">
            Already have an account? <b>Login</b>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
