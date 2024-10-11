import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IBlog } from "../../../interfaces/IBlogs";
import instance from "../../../instance/instance";

export default function BlogHome() {
    const [blogs, setBlog] = useState<IBlog[]>([]);

    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/blogs");
            setBlog(data.data);
        })();
    }, []);

    const extractFirstImage = (content: string): string | null => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const img = doc.querySelector("img");
        return img ? img.src : null;
    };

    const extractTextContent = (content: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        return doc.body.textContent || ""; 
    };

    const extractH1Tag = (content: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const h1 = doc.querySelector("h1");
        return h1 ? h1.textContent || "" : "No title"; 
    };

    return (
        <main className="container-main pb-20">
            <div className="container m-auto">
                <h2 className="text-2xl font-bold mb-10 text-orange-500 flex justify-center mt-4">TIN TỨC</h2>

                <div className="flex flex-col gap-4"> 
                    {blogs && blogs.length > 0 && (
                        <div className="flex bg-white rounded-lg shadow-lg"> 
                            <img
                                src={extractFirstImage(blogs[0].content) || blogs[0].image}
                                className="w-[284px] h-auto rounded-l-lg object-cover " 
                                alt={blogs[0].slug}
                            />
                            <div className="p-4 flex-1">
                                <h1 className="text-lg font-bold text-gray-700 mb-2">
                                    {extractH1Tag(blogs[0].content)} 
                                </h1>
                                <p className="text-sm text-gray-500 mb-2">
                                    Người viết: {blogs[0].user_id} - {new Date(blogs[0].createdAt).toLocaleDateString()} 
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {extractTextContent(blogs[0].content)} 
                                </p>
                             
                                <Link
                                    to={`/detailBlog/${blogs[0].slug}`} 
                                    className="inline-flex items-center bg-orange-400 text-white py-2 px-4 rounded mt-4 hover:bg-orange-500 transition"
                                >
                                    Xem chi tiết
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        width="25px"
                                        height="25px"
                                        className="ml-2"
                                    >
                                        <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}

                    {blogs &&
                        blogs.length > 1 &&
                        blogs.slice(1).map((blog) => (
                            <div key={blog.id} className="flex bg-white rounded-lg shadow-md">
                                <img
                                    src={extractFirstImage(blog.content) || blog.image} 
                                    className="w-[284px] h-auto object-cover rounded-l-md"
                                    alt={blog.slug}
                                />
                                <div className="p-4 flex-1">
                                    <h2 className="text-base font-bold text-gray-700 mb-2">
                                        {extractH1Tag(blog.content)} 
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-2">Người viết: {blog.user_id} </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {extractTextContent(blog.content)} 
                                    </p>
                                  
                                    <Link
                                        to={`/detailBlog/${blog.slug}`} 
                                        className="inline-flex items-center bg-orange-400 text-white py-2 px-4 rounded mt-4 hover:bg-orange-500 transition"
                                    >
                                        Xem chi tiết
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            width="25px"
                                            height="25px"
                                            className="ml-2"
                                        >
                                            <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </main>
    );
}
