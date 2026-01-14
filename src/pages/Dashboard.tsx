import { BlogList } from "./BlogList";
import { Sidebar } from "../components/sidebar";

export const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="h-screen overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 max-h-screen overflow-y-auto p-4">
        <BlogList />
      </div>
    </div>
  );
};
