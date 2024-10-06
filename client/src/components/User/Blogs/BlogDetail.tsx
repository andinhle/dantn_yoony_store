import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";
import { IBlog } from "../../../interfaces/IBlogs";
import instance from "../../../instance/instance";

export default function BlogDetail() {
  const { slug } = useParams();  // Get the slug from the URL
  const [blog, setBlog] = useState<IBlog | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`/blogs/${slug}`);
        setBlog(data.data);  // Assuming the API returns data in data.data
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    })();
  }, [slug]);

  if (!blog) {
    return <p className="text-center">Đang tải dữ liệu...</p>;
  }

  return (
    <main className="container-main pb-10">
      <div className="container m-auto">
        <h2 className="text-3xl font-bold text-orange-500 mb-5 text-center mt-4">{blog.title}</h2>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src={blog.image}
            className="w-full h-[400px] object-cover mb-6 rounded"
            alt={blog.slug}
          />
          <p className="text-sm text-gray-500 mb-4">
            Người viết : {blog.user_id} - {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <div className="text-lg text-gray-700">
            {HTMLReactParser(blog.content)}  {/* Parsing the HTML content */}
          </div>
        </div>
      </div>
    </main>
  );
}
