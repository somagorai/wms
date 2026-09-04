import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import logo from "figma:asset/0cbf7aa367bef87c8bd0f1fedc1e56dd4afd0a48.png";
import warehouseBg from "figma:asset/cea255fdb881dc93ee6bd7074625c2ded70e5fd9.png";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);

    if (success) {
      navigate("/app/home");
    } else {
      setError("Invalid username or password");
      setPassword("");
    }
  };

  const handleSSO = () => {
    // SSO functionality placeholder
    console.log("SSO login clicked");
  };

  const handleDemoLogin = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
    setError("");
    
    const success = login(username, password);
    if (success) {
      navigate("/app/home");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={warehouseBg}
          alt="Warehouse Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="OPTO Logo" className="h-16 w-auto" />
          </div>

          {/* Login Card */}
          <div className="bg-zinc-900/90 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-zinc-800">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Sign In
            </h1>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-zinc-400 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#50e3c3] focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-zinc-400 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#50e3c3] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white font-semibold rounded-lg transition-colors shadow-lg shadow-[#0d9488]/30 dark:shadow-[#50e080]/30"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* SSO Button */}
            <button
              type="button"
              onClick={handleSSO}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg border border-zinc-700 transition-colors"
            >
              Sign in with SSO
            </button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <p className="text-xs text-zinc-400 mb-2">
                Demo Credentials (click to login):
              </p>
              <div className="space-y-1 text-xs text-zinc-500 font-mono">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin", "admin")}
                  className="w-full text-left hover:bg-zinc-700/30 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <span className="text-[#0d9488] dark:text-[#50e080]">admin</span> /{" "}
                  <span className="text-[#0d9488] dark:text-[#50e080]">admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("user", "user")}
                  className="w-full text-left hover:bg-zinc-700/30 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <span className="text-[#0d9488] dark:text-[#50e080]">user</span> /{" "}
                  <span className="text-[#0d9488] dark:text-[#50e080]">user</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            © 2026 OPTO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}