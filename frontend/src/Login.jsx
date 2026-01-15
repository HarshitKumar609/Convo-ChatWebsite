import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "./Context/Authcontext";

const Login = () => {
  const navigate = useNavigate();
  const { authUser, setauthUser } = useAuth();

  // UI state
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup state
  const [signupData, setSignupData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    gender: "",
  });

  /* ---------------- LOGIN ---------------- */

  const handleLoginInput = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        loginData,
        { withCredentials: true }
      );
      console.log(res);
      toast.success(res.data.message);

      localStorage.setItem("chatapp", JSON.stringify(res.data));

      setauthUser(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP ---------------- */

  const handleSignupInput = (e) => {
    setSignupData({
      ...signupData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (gender) => {
    setSignupData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (signupData.password !== signupData.confirmpassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post(
        "https://convo-chat-backend.vercel.app/api/auth/register",
        signupData,
        { withCredentials: true }
      );

      const data = res.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.error);
      }

      toast.success(res.data.message);
      localStorage.setItem("chatapp", JSON.stringify(res.data));

      setauthUser(res.data);
      setLoading(false);
      setIsLogin(true); // switch to login after signup
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      navigate("/", { replace: true });
    }
  }, [authUser, navigate]);

  return (
    <div className="min-h-screen w-full flex">
      {/* LEFT IMAGE SECTION */}
      <div className="hidden md:flex w-1/2 bg-linear-to-t from-black/90 to-indigo-400 items-center justify-center">
        <div className="text-white text-center px-10">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <img src="./LoginBg.png" alt="login" />
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-linear-to-b to-black/90 from-indigo-400">
        <div className="w-full max-w-md p-8">
          {/* TOGGLE BUTTONS */}
          <div className="flex mb-8 bg-black/40 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-lg ${
                isLogin
                  ? "bg-indigo-500 text-white font-semibold"
                  : "text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-lg ${
                !isLogin
                  ? "bg-purple-500 text-white font-semibold"
                  : "text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 ">
              <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>

              <input
                id="email"
                type="email"
                placeholder="Email"
                onChange={handleLoginInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300 text-black"
                required
              />

              <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={handleLoginInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300 text-black"
                required
              />

              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {!isLogin && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Create Account
              </h2>

              <input
                id="fullname"
                type="text"
                placeholder="Full Name"
                onChange={handleSignupInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300  text-black"
                required
              />

              <input
                id="username"
                type="text"
                placeholder="Username"
                onChange={handleSignupInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300 text-black"
                required
              />

              <input
                id="email"
                type="email"
                placeholder="Email"
                onChange={handleSignupInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300 text-black"
                required
              />

              <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={handleSignupInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300  text-black"
                required
              />

              <input
                id="confirmpassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleSignupInput}
                className="w-full px-4 py-3 rounded-lg bg-gray-300  text-black"
                required
              />

              {/* Gender */}
              <div className="flex gap-4 text-white">
                <span className="font-bold">Gender:</span>

                <label className="flex gap-2 cursor-pointer">
                  <span>Male</span>
                  <input
                    type="checkbox"
                    checked={signupData.gender === "male"}
                    onChange={() => selectGender("male")}
                  />
                </label>

                <label className="flex gap-2 cursor-pointer">
                  <span>Female</span>
                  <input
                    type="checkbox"
                    checked={signupData.gender === "female"}
                    onChange={() => selectGender("female")}
                  />
                </label>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg">
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
