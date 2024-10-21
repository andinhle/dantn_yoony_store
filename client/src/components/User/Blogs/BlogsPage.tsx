import { Link } from "react-router-dom";
import HTMLReactParser from "html-react-parser";

interface IBlog {
    id: number;
    content: string;
    image: string;
    slug: string;
}

export default function BlogPage() {
    const blogs: IBlog[] = [
        {
            id: 1,
            content:
                "Áo Polo là sự kết hợp hài hòa giữa áo thun và sơ mi, mỗi thiết kế form dáng của áo Polo sẽ phù hợp với từng phong cách...",
            image: "https://s.net.vn/z54k",
            slug: "4-form-ao-polo-dep",
        },
        {
            id: 2,
            content:
                "Áo Polo Ninomaxx Concept luôn là một trong những must-have items với những tín đồ thời trang bởi sự đa dạng về thiết kế...",
            image: "https://s.net.vn/1OAH",
            slug: "cach-bao-quan-giu-form",
        },
        {
            id: 3,
            content:
                "Đối với nhiều nhà phê bình thời trang và những fashionista nổi tiếng thế giới, áo thun Polo chính là một trong những items không thể thiếu...",
            image: "https://s.net.vn/z54k",
            slug: "5-cach-phoi-polo",
        },
        {
            id: 4,
            content:
                "Áo Polo đã trở thành một biểu tượng của phong cách thời trang thanh lịch và năng động. Phối với quần jeans hay quần âu đều phù hợp...",
            image: "https://s.net.vn/1OAH",
            slug: "phoi-polo-voi-jeans",
        },
        {
            id: 5,
            content:
                "Ninomaxx Concept mang đến những mẫu áo Polo với chất liệu cao cấp, kiểu dáng hiện đại, phù hợp với mọi lứa tuổi...",
            image: "https://s.net.vn/z54k",
            slug: "ninomaxx-polo-style",
        },
        {
            id: 6,
            content:
                "Áo Polo không chỉ là một món đồ thời trang mà còn mang lại cảm giác thoải mái trong mọi hoàn cảnh...",
            image: "https://s.net.vn/1OAH",
            slug: "comfort-polo-wear",
        },
        {
            id: 3,
            content:
                "Đối với nhiều nhà phê bình thời trang và những fashionista nổi tiếng thế giới, áo thun Polo chính là một trong những items không thể thiếu...",
            image: "https://s.net.vn/z54k",
            slug: "5-cach-phoi-polo",
        },
        {
            id: 4,
            content:
                "Áo Polo đã trở thành một biểu tượng của phong cách thời trang thanh lịch và năng động. Phối với quần jeans hay quần âu đều phù hợp...",
            image: "https://s.net.vn/1OAH",
            slug: "phoi-polo-voi-jeans",
        },
        {
            id: 5,
            content:
                "Ninomaxx Concept mang đến những mẫu áo Polo với chất liệu cao cấp, kiểu dáng hiện đại, phù hợp với mọi lứa tuổi...",
            image: "https://s.net.vn/z54k",
            slug: "ninomaxx-polo-style",
        },
        {
            id: 6,
            content:
                "Áo Polo không chỉ là một món đồ thời trang mà còn mang lại cảm giác thoải mái trong mọi hoàn cảnh...",
            image: "https://s.net.vn/1OAH",
            slug: "comfort-polo-wear",
        },
    ];

    return (
        <main className="container-main pb-10">
            <div className="container m-auto">
                <h2 className="text-xl font-bold mb-5 flex flex-col items-center mt-4 text-orange-500">Tin Tức</h2>

                <div className="flex gap-2">
                    {blogs && blogs.length > 0 && (
                        <div className="relative flex-1 bg-white rounded-lg">
                            <img
                                src={blogs[0].image}
                                className="w-full h-[380px] rounded mb-5 object-cover" 
                                alt={blogs[0].slug}
                            />
                            <div className="absolute inset-0 flex flex-col justify-end">
                                <div className="bg-white opacity-90 rounded-md p-4 shadow-md w-4/5 mx-auto"> 
                                    <h3 className="text-xl  font-bold mb-2">{blogs[0].slug}</h3>
                                    <p className="text-sm text-gray-500 mb-1">Người viết: andinhle - 20-6-2024</p>
                                    <p className="text-base text-gray-600 mb-5 line-clamp-3">
                                        {HTMLReactParser(blogs[0].content)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 flex flex-col overflow-y-auto h-[500px]">
                        {blogs &&
                            blogs.length > 1 &&
                            blogs.slice(1).map((blog) => (
                                <div key={blog.id} className="flex bg-white ml-4 rounded-lg mb-4 shadow-md">
                                    <img
                                        src={blog.image}
                                        className="w-[204px] h-[146px] object-cover rounded mr-3"
                                        alt={blog.slug}
                                    />
                                    <div className="flex flex-col justify-between flex-1 p-4">
                                        <h3 className="text-lg font-semibold mb-1">{blog.slug}</h3>
                                        <p className="text-sm text-gray-500 mb-1">Người viết: andinhle - 20-6-2024</p>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {HTMLReactParser(blog.content)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        <div className="flex justify-center mt-6">
                            <Link
                                to="/blogs"
                                className="inline-flex items-center bg-orange-400 text-white py-2 px-6 rounded hover:bg-orange-500"
                            >
                                Xem tất cả bài viết
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
                </div>
            </div>
        </main>
    );
}
