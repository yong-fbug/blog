import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authUser";
import { LogOutIcon } from "lucide-react";
import { BlogCreate } from "../pages/BlogCreate";

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.log("logout error", error);
    }
  };
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center">
      <div className="bg-teal-900 h-screen w-fit p-4 flex flex-col items-center space-y-10">
        <p className="text-white font-bold tracking-wider">BLOG</p>

        <div className="relative group">
          <BlogCreate />

          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800
           text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 
           transition-opacity pointer-events-none"
          >
            Add Blog
          </span>
        </div>

        <button onClick={handleLogout}>
          <LogOutIcon className="text-white cursor-pointer" />
        </button>
      </div>
    </div>
  );
};
