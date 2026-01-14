import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteBlogs,
  fetchBlogs,
  updateBlogs,
} from "../features/blog/blogSlice";
import { supabase } from "../services/supaBaseClient";
import { Edit, Trash } from "lucide-react";
import type { BlogTypes } from "../features/blog/types";

export const BlogList = () => {
  const [page, setPage] = useState<number>(0);
  const dispatch = useAppDispatch();
  const blogs = useAppSelector((s) => s.blog.blogs);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [updateBlog, setUpdateBlog] = useState<BlogTypes | null>(null);
  const [isBlogDeleted, setisBlogDeleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user?.user_metadata?.user_name || "");
    };
    fetchUser();
  }, []);

  useEffect(() => {
    dispatch(fetchBlogs(page));
  }, [page]);

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateBlog) return;

    try {
      await dispatch(updateBlogs(updateBlog)).unwrap();
      setUpdateBlog(null);
      dispatch(fetchBlogs(page));
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    try {
      await dispatch(deleteBlogs(id)).unwrap();
      setisBlogDeleted(true);
    } catch (error) {
      console.log("Deleted failed", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex items-center justify-end">
      <div className="space-y-4 ">
        {/* blog list */}
        {blogs.map((b) => (
          <div
            key={b.id}
            className={`w-3xs  bg-white shadow-md p-4 rounded-lg 
            border border-gray-200 hover:shadow-lg transition`}
          >
            <div className="flex-row justify-between items-center mb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-gray-800 font-semibold">
                  {b.title}
                </h2>
                {/* edit button */}
                {b.user_name === currentUser && (
                  <span>
                    <Edit
                      onClick={() => setUpdateBlog(b)}
                      size={20}
                      className="hover:text-green-600 transition"
                    />
                  </span>
                )}
              </div>
              <h2 className="text-sm text-gray-700">{b.content}</h2>
              <span className="text-sm text-gray-500">
                from: {b.user_name === currentUser ? "Me" : b.user_name}
              </span>
            </div>

            {/* Blog update */}
            {updateBlog?.id === b.id && (
              <form>
                <input
                  type="text"
                  name="title"
                  value={updateBlog?.title}
                  onChange={(e) =>
                    setUpdateBlog({
                      ...updateBlog,
                      title: e.target.value,
                    } as BlogTypes)
                  }
                />

                <input
                  type="text"
                  name="content"
                  value={updateBlog?.content}
                  onChange={(e) =>
                    setUpdateBlog({
                      ...updateBlog,
                      content: e.target.value,
                    } as BlogTypes)
                  }
                />

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleUpdateBlog}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpdateBlog(null)}
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => b.id !== undefined && handleDeleteBlog(b.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}

        {isBlogDeleted && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
              <div className=" flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Deleted Successfully
                </h2>
                <Trash className="text-red-700" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your blog post has been removed.
              </p>

              <button
                onClick={() => setisBlogDeleted(false)}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-400 hover:text-gray-700 disabled:opacity-50 transition"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={blogs.length < 5}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-400 hover:text-gray-700 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
