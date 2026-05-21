import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { adminLoginApi } from "../../../Api/adminApi";

const AdminLoginLayout = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {

    try {

      setLoading(true);

      const response = await adminLoginApi({
        email,
        password,
      });

      // STORE TOKEN
      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      toast.success("Login successful");

      // REDIRECT
      navigate("/admin/dashboard");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0B1240] flex items-center justify-center px-4 host-grotesk">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-[200px] h-[120px] rounded-2xl flex items-center justify-center shadow-lg">

            <img
              src="/logo.png"
              alt="logo"
              className="w-[200px] h-[120px] object-cover"
            />

          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">

          <h1 className="text-white text-5xl font-bold tracking-tight mb-4">
            Welcome back
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed">
            Sign in to your admin account to continue managing
            your company dashboard
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-[#1C2452] border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Email */}
          <div className="mb-6">

            <label className="block text-white font-medium mb-3">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full h-14 rounded-2xl bg-[#2A3260] border border-white/10 px-5 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition-all duration-300"
            />

          </div>

          {/* Password */}
          <div className="mb-4">

            <label className="block text-white font-medium mb-3">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full h-14 rounded-2xl bg-[#2A3260] border border-white/10 px-5 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition-all duration-300"
            />

          </div>

          {/* Forgot Password */}
        
          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white font-semibold text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >

            {
              loading
                ? "Signing In..."
                : "Sign In"
            }

          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminLoginLayout;