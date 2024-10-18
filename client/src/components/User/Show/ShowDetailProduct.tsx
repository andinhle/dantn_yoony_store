import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../../instance/instance";
import { IProduct } from "../../../interfaces/IProduct";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, message, Rate } from "antd";
import Zoom from "react-zoom-image-hover";
import { Label } from "flowbite-react";
import ShowProductRelated from "./ShowProductRelated";
import { useForm } from "react-hook-form";
import { ICart } from "../../../interfaces/ICart";
import { toast } from "react-toastify";
import CartContext from "../../../contexts/CartContext";
import axios from "axios";

type Iitem = {
  id?: number;
  price: number;
  sale_price: number;
  quantity: number;
  size: string;
};
type IVariantMerge = {
  color: string;
  representativeImage: string;
  items: Iitem[];
};
type IVariant = {
  id: number;
  price: number;
  sale_price: number;
  quantity: number;
};

const ShowDetailProduct = () => {
  const { category, slugproduct } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [related_products, setRelated_Products] = useState<IProduct[]>([]);
  const [imageProducts, setImageProducts] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColorImage, setSelectedColorImage] = useState<string>("");
  const [variantMerge, setVariantMerge] = useState<IVariantMerge[]>([]);
  const [getVariant, setVariant] = useState<IVariant[]>([]);
  const [quantity, setQuantity] = useState(1);
  const {carts, dispatch } = useContext(CartContext);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  // const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleImageClick = () => {
    setIsZoomEnabled(!isZoomEnabled);
  };
  const handleChangeQuanlity = (e: any) => {
    const value = Math.max(1, Number(e?.target.value));
    setQuantity(value);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`home/product/${slugproduct}`);
        setProduct(data.product);
        setRelated_Products(data.related_products);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [slugproduct]);

  useEffect(() => {
    if (product) {
      const variantImages = product.variants.flatMap(
        (variant) => variant.image || []
      );
      const productMainImage = product.images?.[0];
      setImageProducts(
        productMainImage ? [productMainImage, ...variantImages] : variantImages
      );
      setSelectedImage(productMainImage);
    }
  }, [product]);

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  const handleVariantSelect = (variant: IVariantMerge) => {
    console.log(variant);
    setSelectedColorImage(variant?.representativeImage);
    setSelectedImage(variant?.representativeImage);
  };

  const groupVariantsByColor = (variants: any) => {
    const colorGroups = variants.reduce((groups: any, variant: any) => {
      const colorAttr = variant.attribute_values.find(
        (attr: any) => attr.attribute.slug === "color"
      );
      const color = colorAttr ? colorAttr.value : "Unknown";

      if (!groups[color]) {
        groups[color] = {
          color,
          representativeImage: variant.image || null,
          items: [],
        };
      }

      if (variant.image) {
        groups[color].representativeImage = variant.image;
      }

      groups[color].items.push({
        id: variant.id,
        price: variant.price,
        sale_price: variant.sale_price,
        quantity: variant.quantity,
        size: variant.attribute_values.find(
          (attr: any) => attr.attribute.slug === "size"
        ).value,
      });

      return groups;
    }, {});

    return Object.values(colorGroups);
  };

  useEffect(() => {
    if (product) {
      const groupedData = groupVariantsByColor(product.variants);
      setVariantMerge(groupedData as IVariantMerge[]);
      if (groupedData.length > 0) {
        setSelectedColorImage(groupedData[0]?.representativeImage || "");
        setSelectedImage(groupedData[0]?.representativeImage || "");
        setSelectedSize(groupedData[0]?.items[0]?.size || "");
      }
    }
  }, [product]);

  // console.log(selectedImage);

  const allItems = variantMerge.flatMap((variant) => variant.items);
  const uniqueSizes = [...new Set(allItems.map((item) => item.size))];

  // console.log(product);
  // console.log(variantMerge);
  // console.log(selectedColorImage);
  useEffect(() => {
    const filterItems = (data: any, img: string, size: string) => {
      return data
        .filter((item: any) => item?.representativeImage === img)
        .flatMap((item: any) =>
          item.items.filter((subItem: any) => subItem.size === size)
        );
    };
    setVariant(filterItems(variantMerge, selectedColorImage, selectedSize));
  }, [selectedColorImage, selectedSize]);

  const addCart = async () => {
    try {
      const {
        data:{data:response}
      } = await instance.post("cart", {
        quantity,
        variant_id: getVariant[0].id,
        user_id: 1,
      });
      if (response) {
        message.success("Đã thêm sản phẩm vào giỏ hàng");
        dispatch({
          type: "ADD",
          payload: response,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message==="Unauthenticated.") {
          toast.error("Vui lòng đăng nhập !");
        }
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Đã xảy ra lỗi không mong muốn');
      }
    }
  };
  return (
    <section className="space-y-8">
      <Breadcrumb
        className="my-5"
        items={[
          {
            path: "/",
            title: (
              <Link to="/">
                <HomeOutlined /> Trang chủ
              </Link>
            ),
          },
          {
            path: `${category}`,
            title: <Link to={`/${category}`}>{category}</Link>,
          },
          {
            className: "!text-primary",
            title: slugproduct,
          },
        ]}
      />
      <div className="grid grid-cols-2 gap-9">
        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-2 flex flex-col gap-5">
            {imageProducts.map((imageProduct, index) => {
              return (
                <img
                  src={imageProduct}
                  key={index}
                  className={`rounded-lg max-h-[100px] max-w-[100px] w-fulll object-cover hover:cursor-pointer hover:scale-110 transition-all ${
                    selectedImage === imageProduct
                      ? "border border-primary"
                      : ""
                  }`}
                  alt={`Product image ${index + 1}`}
                  onClick={() => handleImageSelect(imageProduct)}
                />
              );
            })}
          </div>
          <div className="col-span-8">
            {isZoomEnabled ? (
              <Zoom
                height={460}
                width={"100%"}
                className="max-h-[460px] w-full rounded-lg img-zoom hover:cursor-zoom-in"
                zoomScale={2}
                onClick={handleImageClick}
                src={selectedImage}
              />
            ) : (
              <img
                src={selectedImage}
                alt="Product"
                className="max-h-[460px] w-full rounded-lg object-cover hover:cursor-zoom-in"
                onClick={handleImageClick}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="font-medium text-xl line-clamp-2">{product?.name}</h2>
          <div className="flex gap-7 items-center mt-2">
            <div>
              <span className="text-primary">4.5 </span>
              <Rate disabled allowHalf defaultValue={4.5} />
            </div>
            {getVariant && getVariant.length >= 1 ? (
              <div className="py-1 px-3 bg-[#3CD139]/10 text-[#3CD139] rounded-full flex gap-1 w-fit text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M12 22C11.1818 22 10.4002 21.6646 8.83693 20.9939C4.94564 19.3243 3 18.4895 3 17.0853L3 7.7475M12 22C12.8182 22 13.5998 21.6646 15.1631 20.9939C19.0544 19.3243 21 18.4895 21 17.0853V7.7475M12 22L12 12.1707M21 7.7475C21 8.35125 20.1984 8.7325 18.5953 9.495L15.6741 10.8844C13.8712 11.7419 12.9697 12.1707 12 12.1707M21 7.7475C21 7.14376 20.1984 6.7625 18.5953 6M3 7.7475C3 8.35125 3.80157 8.7325 5.40472 9.495L8.32592 10.8844C10.1288 11.7419 11.0303 12.1707 12 12.1707M3 7.7475C3 7.14376 3.80157 6.7625 5.40472 6M6.33203 13.311L8.32591 14.2594"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2V4M16 3L14.5 5M8 3L9.5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Còn hàng{`: ${getVariant[0]?.quantity}`}
              </div>
            ) : (
              <div className="py-1 px-3 bg-primary/10  text-primary rounded-full flex gap-1 w-fit text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Hết hàng
              </div>
            )}
          </div>
          {getVariant && getVariant.length >= 1 ? (
            <div className="flex gap-3 text-2xl my-5 bg-[#FAFAFA] rounded-md p-3 items-center">
              <span className="line-through text-xl text-[#929292]">
                {getVariant[0]?.price
                  .toLocaleString("vi-VN", {
                    useGrouping: true,
                    maximumFractionDigits: 0,
                  })
                  .replace(/,/g, ".")}
                đ
              </span>
              <span className="text-primary font-medium">
                {getVariant[0]?.sale_price
                  .toLocaleString("vi-VN", {
                    useGrouping: true,
                    maximumFractionDigits: 0,
                  })
                  .replace(/,/g, ".")}
                đ
              </span>
            </div>
          ) : (
            <div className="flex gap-3 text-2xl my-5 bg-primary/10 rounded-md p-3 items-center">
              <div className="text-xl text-primary flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-8"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                HẾT HÀNG
              </div>
            </div>
          )}
          <form className="space-y-5">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="color-product"
                  className="text-[#929292] !font-normal !text-sm"
                  value="Màu sắc"
                />
              </div>
              <div className="flex gap-2">
                {variantMerge.flatMap((variant, index) => {
                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden"
                      onClick={() => handleVariantSelect(variant)}
                    >
                      <img
                        className={`w-12 h-12 rounded-lg hover:cursor-pointer border border-input transition-all object-cover hover:border-primary ${
                          selectedColorImage === variant.representativeImage
                            ? "border border-primary"
                            : ""
                        }`}
                        src={variant?.representativeImage}
                      />
                      {selectedColorImage === variant.representativeImage && (
                        <span className="text-util absolute -top-1 -right-1 bg-primary rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-4"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* <span className="block text-sm text-red-500 mt-1">
                {errors.email?.message}
              </span> */}
            </div>
            <div>
              <div className="mb-2 block ">
                <Label
                  htmlFor="size-product"
                  className="text-[#929292] !font-normal !text-sm"
                  value="Size"
                />
              </div>
              <div className="flex gap-2">
                {uniqueSizes.map((size) => (
                  <div
                    key={size}
                    className="relative overflow-hidden"
                    onClick={() => {
                      setSelectedSize(size);
                    }}
                  >
                    <button
                      type="button"
                      className={`h-10 w-12 border text-sm border-input hover:border-primary transition-all hover:text-primary rounded-md ${
                        selectedSize === size
                          ? "border-primary text-primary"
                          : ""
                      }`}
                    >
                      {size}
                    </button>
                    {selectedSize === size && (
                      <span className="text-util absolute -top-1 -right-1 bg-primary rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-4"
                          color={"currentColor"}
                          fill={"none"}
                        >
                          <path
                            d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* <span className="block text-sm text-red-500 mt-1">
                {errors.email?.message}
              </span> */}
            </div>
            <div className="flex gap-3 items-center">
              <Label
                htmlFor="color-product"
                className="text-[#929292] !font-normal !text-sm"
                value="Số lượng"
              />
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity(quantity > 1 ? quantity - 1 : 1);
                  }}
                  className="p-3 border-input rounded-es-sm rounded-ss-sm text-[#929292] border-s border-b border-t"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-3"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M20 12L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <input
                  min={1}
                  value={quantity}
                  onChange={handleChangeQuanlity}
                  className="w-10 p-1.5 border border-input outline-none text-center"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setQuantity(quantity + 1);
                  }}
                  className="p-3 border-input rounded-ee-sm rounded-se-sm text-[#929292] border-e border-t border-b"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-3"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M12 4V20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 12H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex gap-5">
              <button
                onClick={addCart}
                type="button"
                className="py-2 px-4 border border-primary rounded-md text-primary flex gap-1.5 items-center hover:bg-primary hover:text-util transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 6H6.5M22 6H19.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.5 6H16.5M13 9.5V2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="6"
                    cy="20"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="17"
                    cy="20"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 20L15 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Thêm giỏ hàng
              </button>
              <button className="py-2 px-4 bg-primary text-util rounded-md flex gap-1.5 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M13 18H21M17 22L17 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 7.5V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 22C7.71999 21.9999 6.57085 21.9917 5.76809 21.2752C4.95603 20.5505 4.75097 19.3264 4.34085 16.8781L3.17786 9.93557C2.98869 8.8063 2.89411 8.24167 3.18537 7.87083C3.47662 7.5 4.01468 7.5 5.09079 7.5H18.9092C19.9853 7.5 20.5234 7.5 20.8146 7.87083C21.1059 8.24167 21.0113 8.8063 20.8221 9.93557L20.4763 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.5 17.5H10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Mua hàng
              </button>
            </div>
          </form>
        </div>
      </div>
      <ShowProductRelated related_products={related_products} />
      {/* <ShowMiniCart isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </section>
  );
};

export default ShowDetailProduct;
