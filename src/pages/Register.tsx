import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { register } from "../features/auth/authUser";

export const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegister(false);
    setErrorMessage(null);

    try {
      const result = await dispatch(
        register({ email, username, password })
      ).unwrap();
      console.log("Success Registeration", result);
      navigate("/login");
    } catch (error: any) {
      console.log(error.message, "Error register");
      if (error.message.includes("email")) {
        setErrorMessage("Email already existed");
      } else if (error.message.includes("username")) {
        setErrorMessage("Username already Existed");
      } else {
        setErrorMessage("Registration failed");
      }
      setIsRegister(true);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className=" px-6">
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-5 p-6 rounded-xl w-80 bg-white shadow-md justify-center"
        >
          <h2 className="text-gray-800 text-2xl font-semibold text-center mb-4">
            Create Account
          </h2>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
            required
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="none"
              required
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

          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg hover:bg-teal-600 transition"
          >
            Register
          </button>

          {isRegister && errorMessage && (
            <p className="text-red-500 text-center text-sm mt-1">
              {errorMessage}
            </p>
          )}

          <p
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-teal-500 cursor-pointer text-center mt-2 transition"
          >
            Back
          </p>
        </form>
      </div>
    </div>
  );
};
