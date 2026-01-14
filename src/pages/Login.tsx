import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../features/auth/authSlice";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(null);

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error.message, "Error Login");
      if (error?.message.includes("password")) {
        setIsError("Password Incorrect");
      } else {
        setIsError("Failed to Login");
      }
      console.log("Login failed", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3 text-center">
          Welcome to{" "}
          <span className="text-teal-500 font-bold">Blog by Flores</span>
        </h1>
        <p className="text-gray-600 text-center max-w-sm leading-relaxed">
          Share your thoughts, ideas, and stories with the world. Join our
          community and start creating today!
        </p>
      </div>

      {/* Right login form */}
      <div className="flex items-center justify-end px-6">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 rounded-xl w-lg h-[90vh] p-4 bg-white shadow-md justify-center"
        >
          <h2 className="text-gray-800 text-4xl uppercase tracking-widest font-semibold text-center mb-4">
            Login
          </h2>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="none"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-gray-500 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-teal-500"
              />
              Remember me
            </label>
            <p
              onClick={() => navigate("/Register")}
              className="underline cursor-pointer hover:text-teal-500 transition"
            >
              No Account?
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg hover:bg-teal-600 transition"
            >
              Login
            </button>
            {isError && (
              <p className="text-red-500 text-center text-sm">{isError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
