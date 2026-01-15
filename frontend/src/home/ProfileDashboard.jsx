import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/Authcontext";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ProfileDashboard = () => {
  const { authUser, setauthUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    gender: "",
    password: "",
  });

  const [profilepic, setProfilepic] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* Prefill */
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullname: authUser.fullname || "",
        username: authUser.username || "",
        email: authUser.email || "",
        gender: authUser.gender || "",
        password: "",
      });
      setPreview(authUser.profilepic || "");
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilepic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (profilepic) data.append("profilepic", profilepic);

      const res = await axios.put(
        " https://convo-chatwebsite-backend.onrender/api/auth/update-profile",
        data,
        { withCredentials: true }
      );

      const updatedUser = res.data.user;
      setauthUser(updatedUser);
      localStorage.setItem("chatapp", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully 🎉");
    } catch (error) {
      setMessage(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="
          absolute top-4 left-4
          p-2 rounded-full
          bg-white/10 backdrop-blur-sm
          border border-white/20
          hover:bg-white/20
          transition
        "
      >
        <FaArrowLeft className="text-white text-lg" />
      </button>

      {/* CARD */}
      <div
        className="
          w-full max-w-lg
          bg-white/5 backdrop-blur-sm
          border border-white/10
          rounded-3xl
          shadow-xl shadow-black/40
          p-6 sm:p-8
        "
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Edit Profile
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm text-emerald-400">{message}</p>
        )}

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center gap-3 mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover
      border-4 border-white/20 shadow-md"
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full
      border-4 border-white/20
      flex items-center justify-center
      text-gray-400 text-sm"
            >
              No Image
            </div>
          )}

          <label className="cursor-pointer text-sm text-sky-400 hover:underline">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FULL NAME */}
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Full Name"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 text-white
              border border-white/10
              outline-none
              focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            "
          />

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 text-white
              border border-white/10
              outline-none
              focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            "
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 text-white
              border border-white/10
              outline-none
              focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            "
          />

          {/* GENDER */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 text-white
              border border-white/10
              outline-none
              focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            "
          >
            <option value="" className="bg-slate-900">
              Select Gender
            </option>
            <option value="male" className="bg-slate-900">
              Male
            </option>
            <option value="female" className="bg-slate-900">
              Female
            </option>
          </select>

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 text-white
              border border-white/10
              outline-none
              focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            "
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-2 py-3 rounded-xl
              bg-linear-to-r from-sky-500 to-indigo-500
              text-white font-semibold
              hover:opacity-90
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileDashboard;
