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
 <div className="relative h-full w-full overflow-hidden">
 {/* Background Image */}
 <div className="absolute inset-0">
 <img
 src={warehouseBg}
 alt="Warehouse Background"
 className="w-full h-full object-cover"
 />
 {/* Dark overlay for better text readability */}
 <div className="absolute inset-0 bg-black/50" />
 </div>

 {/* Login Form Container */}
 <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
 <div className="w-full max-w-md">
 {/* Logo */}
 <div className="flex justify-center mb-8">
 <img src={logo} alt="OPTO Logo" className="h-16 w-auto" />
 </div>

 {/* Login Card */}
 <div className="bg-[var(--surface-container-high)] text-[var(--foreground)]/90 backdrop-blur-md rounded-lg p-8 border-[var(--border)] ">
 <h1 className="text-2xl font-bold text-[var(--foreground)]  mb-6 text-center">
 Sign In
 </h1>

 {/* Error Message */}
 {error && (
 <div className="mb-6 p-3 bg-[var(--state-error)]/20 border border-[var(--state-error)]/40 rounded-lg">
 <p className="text-[var(--state-error)] text-sm text-center">
 {error}
 </p>
 </div>
 )}

 {/* Login Form */}
 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label
 htmlFor="username"
 className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2"
 >
 Username
 </label>
 <input
 id="username"
 type="text"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] focus:border-transparent transition-all"
 placeholder="Enter your username"
 required
 autoFocus
 />
 </div>

 <div>
 <label
 htmlFor="password"
 className="block text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2"
 >
 Password
 </label>
 <input
 id="password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full px-4 py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus: focus:)] focus:border-transparent transition-all"
 placeholder="Enter your password"
 required
 />
 </div>

 <button
 type="submit"
 className="w-full py-3 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] font-semibold rounded-lg transition-colors "
 >
 Sign In
 </button>
 </form>

 {/* Divider */}
 <div className="relative my-6">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-[var(--border)] " />
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="px-2 bg-[var(--surface-container-high)] text-[var(--foreground)] text-[var(--muted-foreground)]">
 Or continue with
 </span>
 </div>
 </div>

 {/* SSO Button */}
 <button
 type="button"
 onClick={handleSSO}
 className="w-full py-3 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)] text-[var(--foreground)] font-semibold rounded-lg border-[var(--border)]  transition-colors"
 >
 Sign in with SSO
 </button>

 {/* Demo Credentials */}
 <div className="mt-6 p-4 bg-[var(--surface-container-lowest)] dark:bg-[var(--surface-container)] rounded-lg border-[var(--border)] /50">
 <p className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-2">
 Demo Credentials (click to login):
 </p>
 <div className="space-y-1 text-xs text-[var(--muted-foreground)] font-mono">
 <button
 type="button"
 onClick={() => handleDemoLogin("admin", "admin")}
 className="w-full text-left hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]/30 px-2 py-1 rounded transition-colors cursor-pointer"
 >
 <span className="text-[var(--primary)] dark:text-[var(--primary)]">admin</span> /{" "}
 <span className="text-[var(--primary)] dark:text-[var(--primary)]">admin</span>
 </button>
 <button
 type="button"
 onClick={() => handleDemoLogin("user", "user")}
 className="w-full text-left hover:bg-[var(--surface-container-low)] dark:bg-[var(--surface-container-high)]/30 px-2 py-1 rounded transition-colors cursor-pointer"
 >
 <span className="text-[var(--primary)] dark:text-[var(--primary)]">user</span> /{" "}
 <span className="text-[var(--primary)] dark:text-[var(--primary)]">user</span>
 </button>
 </div>
 </div>
 </div>

 {/* Footer Text */}
 <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
 © 2026 OPTO. All rights reserved.
 </p>
 </div>
 </div>
 </div>
 );
}