import { useContext, useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { ToggleSwitch } from "flowbite-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import slugify from "react-slugify";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../instance/instance";
import { BlogContext } from "../../../contexts/BlogsContext";
import { IBlog } from "../../../interfaces/IBlogs";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";

const UpdateBlogsAdmin = () => {
  const [value, setValue] = useState(0);
  const [titleSlugBlog, setTitleSlugBlog] = useState("");
  const [errorBlog, setErrorBlog] = useState<string>("");
  const editorRef = useRef(null);
  const [content, setContent] = useState<string>("");
  const [isActive, setActive] = useState(false);
  const [is_active, activeBlog] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false,
      
      uploader: {
        insertImageAsBase64URI: true,
      },
      height: 500,
    }),
    []
  );
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const {dispatch} = useContext(BlogContext)
  const { handleSubmit } = useForm<IBlog>();
  const onSubmit = async () => {
    try {
      if (titleSlugBlog !== "") {
        setErrorBlog("");
        setActive(true);
      }
      const images = doc.querySelectorAll("img");
      const uploadImagesBlog = Array.from(images).map(async (img) => {
        const src = img.src;
        const response = await fetch(src);
        const fileBlob = await response.blob();
        const formData = new FormData();
        formData.append("file", fileBlob);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_PRESET_KEY_CLOADINARY
        );
        const responseImageCloud = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME_CLOADINARY
          }/image/upload`,
          formData
        );
        return { originalSrc: src, newSrc: responseImageCloud.data.secure_url };
      });
      const dataImagesCloud = await Promise.all(uploadImagesBlog);
      let contentNew = content;
      dataImagesCloud.forEach((img) => {
        contentNew = contentNew.replace(img.originalSrc, img.newSrc);
      });
    const {data} = await instance.put(`blogs/${id}`,{
      content: contentNew,
      slug: slugify(titleSlugBlog),
      is_active: activeBlog,
      user_id: 1 ,
    });
   console.log(data.blog);
    if(data){
      setActive(false);
    }
    toast.success(data.message);
    dispatch({
      type: "UPDATE",
      payload: data.blog 
  
    });
    
    navigate('/admin/blogs')
    } catch (error) {
    
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const h1Element = doc.querySelector("h1");
    if (h1Element) {
      const titleSlug = h1Element.textContent;
      setTitleSlugBlog(titleSlug!);
    }
  }, [content]);

  useEffect(() => {
    const fetchBlogData = async () => {
      const numericId = Number(id); 
      if (!isNaN(numericId)) { 
        try {
          const { data } = await instance.get(`blogs/${numericId}`);
          setContent(data.data.content);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('ID không hợp lệ');
      }
    };
  
    fetchBlogData();
  }, [id]);
  
  return (
        <LoadingOverlay active={isActive} spinner>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <JoditEditor
              ref={editorRef}
              value={content}
              onChange={(newContent) => {
                setContent(newContent);
              }}
              config={config}
            />
            {errorBlog !== "" ? (
              <div className="my-2">
                <span className="text-sm text-red-500">{errorBlog}</span>
              </div>
            ) : (
              ""
            )}
            <div>
              <ToggleSwitch
                label="Trạng thái"
                checked={is_active}
                 onChange={()=> {
                  setActive(!is_active);
                  setValue("is_active", !is_active);
                 }}
                className="my-7"           
                sizing={'sm'}
              />
            </div>
            <ButtonSubmit content="Sửa bài viết" />
          </form>
        </LoadingOverlay>
    
  );
};

export default UpdateBlogsAdmin;
