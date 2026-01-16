import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { createBlog, fetchBlogs } from "../features/blog/blogAction";
import { Check, Plus } from "lucide-react";

export const BlogCreate = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [openCreateBlog, setOpenCreateBlog] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(createBlog({ title, content })).unwrap();
      console.log("Create blog success:", result);
      dispatch(fetchBlogs(0));
      setTitle("");
      setContent("");
      setIsCreated(true);
    } catch (error) {
      console.log(error, "Blog create error here");
    }
  };

  const handleOpenCreateBlog = () => {
    setOpenCreateBlog((prev) => !prev);
  };
  return (
    <div className="relative">
      <div className="relative group inline-block">
        <Plus
          onClick={handleOpenCreateBlog}
          className="w-10 h-10 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition"
        />
      </div>

      {openCreateBlog && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setOpenCreateBlog((prev) => !prev)}
        >
          <div
            className="bg-white rounded-lg p-6 w-80 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleCreateBlog}>
              <div className="flex flex-col">
                <span className="font-bold font-sans text-2xl text-gray-700 flex items-center justify-center">
                  Add BLOG
                </span>
                <label className="text-lg font-medium text-gray-700">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div className="flex flex-col mt-2">
                <label className="text-lg font-medium text-gray-700">
                  Content
                </label>
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Write your content"
                  required
                />
              </div>

              <div className="flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={() => setOpenCreateBlog(false)}
                  className="font-semibold bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="font-semibold bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
                >
                  submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreated && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Created Successfully
              </h2>
              <Check className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">
              Your blog post has been created.
            </p>

            <button
              onClick={() => setIsCreated(false)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
