import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Signup Response:", data);

      if (response.ok) {
        /*
          IMPORTANT:
          If backend signup DOES NOT return access_token,
          then navigate user to login page.
        */

        if (data.data?.access_token) {
          const token = data.data.access_token;

          const user = {
            username,
            email,
          };

          login(token, user);

          navigate({
            to: "/app/dashboard",
          });
        } else {
          navigate({
            to: "/login",
          });
        }
      } else {
        alert(data.detail || "Signup failed");
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5b3a29] to-[#8b5e4a]" />

          <h1 className="text-3xl font-semibold text-[#1a1a1a]">
            Pincher
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-6xl font-semibold text-[#1a1a1a] mb-4">
            Create account
          </h2>

          <p className="text-[#5f5f5f] text-xl">
            Start your AI fashion journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm tracking-widest text-[#4f4f4f] mb-3 uppercase">
              Username
            </label>

            <div className="relative">
              <User
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#777]"
                size={20}
              />

              <input
                type="text"
                placeholder="tanushri"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-full border border-[#ddd] bg-white py-5 pl-14 pr-6 text-lg outline-none focus:ring-2 focus:ring-[#7c5441]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm tracking-widest text-[#4f4f4f] mb-3 uppercase">
              Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#777]"
                size={20}
              />

              <input
                type="email"
                placeholder="you@atelier.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full border border-[#ddd] bg-white py-5 pl-14 pr-6 text-lg outline-none focus:ring-2 focus:ring-[#7c5441]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm tracking-widest text-[#4f4f4f] mb-3 uppercase">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#777]"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-full border border-[#ddd] bg-white py-5 pl-14 pr-14 text-lg outline-none focus:ring-2 focus:ring-[#7c5441]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#777]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full py-5 text-xl rounded-full"
          >
            {loading ? "Creating account..." : "Create account"}
          </GradientButton>
        </form>

        {/* Footer */}
        <p className="text-center text-[#555] mt-8 text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#5b3a29] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;