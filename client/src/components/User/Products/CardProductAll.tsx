import { Swiper, SwiperSlide } from "swiper/react";
import { IVariants } from "../../../interfaces/IVariants";
import { FreeMode } from "swiper/modules";
// import ShowDetailProduct from "../Show/ShowDetailProduct";
import { Modal } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
type Props = {
  imageProduct: string;
  nameProduct: string;
  colorVariantsImages: {
    representativeImage: string;
  }[];
  variants: IVariants[];
  is_featured: boolean;
  is_good_deal: boolean;
  id_Product: number;
  category: string;
};
const CardProductAll = ({
  imageProduct,
  nameProduct,
  colorVariantsImages = [],
  variants = [],
  is_featured,
  is_good_deal,
  category,
}: // id_Product,
Props) => {
  return (
    <div className="min-h-[355px] group max-w-[220px] w-full bg-util rounded-lg overflow-hidden shadow-[0px_1px_4px_0px_rgba(255,_138,_0,_0.25)] cursor-pointer">
      <div className="relative z-40 overflow-hidden">
        <Link to={`/${category}/${slugify(nameProduct)}`}>
          <img
            src={imageProduct}
            alt="product-image"
            className="max-h-[260px] object-cover w-full group-hover:scale-110 group-hover:shadow-lg transition-transform duration-500 ease-in-out"
          />
        </Link>
        <div className="absolute top-2 right-2 z-30 text-primary/70 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-6 hover:fill-primary/75"
            color={"currentColor"}
            fill={"none"}
          >
            <path
              d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute top-2 left-2 z-30 text-primary cursor-pointer bg-primary/10 p-1 rounded-full">
          {is_featured && <span className="text-xs">HOT</span>}
        </div>
        <div className="absolute top-2 left-2 z-30 text-primary cursor-pointer bg-primary/10 p-1.5 rounded-full">
          {is_good_deal && (
            <span className="text-xs">
              {100 - (variants[0]?.sale_price / variants[0]?.price) * 100}%
            </span>
          )}
        </div>
        {/* <div className="bg-primary/25 absolute top-0 z-40 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer ">
            <div
              className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-util p-2 rounded-full hover:cursor-pointer text-primary transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M8 16H15.2632C19.7508 16 20.4333 13.1808 21.261 9.06904C21.4998 7.88308 21.6192 7.2901 21.3321 6.89503C21.1034 6.58036 20.7077 6.51633 20 6.5033"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9 6.5H17M13 10.5V2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8 16L5.37873 3.51493C5.15615 2.62459 4.35618 2 3.43845 2H2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8.88 16H8.46857C7.10522 16 6 17.1513 6 18.5714C6 18.8081 6.1842 19 6.41143 19H17.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="10.5"
                  cy="20.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="17.5"
                  cy="20.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div> */}
      </div>
      <Link to={`/${category}/${slugify(nameProduct)}`}>
        <div className="px-3.5 space-y-3 py-3">
          <p className="line-clamp-1 text-sm  md:text-base">{nameProduct}</p>
          <div className="flex gap-2 text-sm">
            <span className="line-through">
              {variants[0]?.price
                .toLocaleString("vi-VN", {
                  useGrouping: true,
                  maximumFractionDigits: 0,
                })
                .replace(/,/g, ".")+'đ'}
            </span>
            <span className="text-primary font-medium">
              {variants[0]?.sale_price?.toLocaleString("vi-VN", {
                  useGrouping: true,
                  maximumFractionDigits: 0,
                })
                .replace(/,/g, ".")+'đ'}
            </span>
          </div>
          <Swiper
            slidesPerView={6}
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper px-5 z-50"
          >
            {colorVariantsImages.map((colorVariantImage, index: number) => {
              return (
                <SwiperSlide
                  key={index + 1}
                  className="!w-7 !h-7 rounded-full border border-input overflow-hidden"
                >
                  <img
                    src={colorVariantImage?.representativeImage}
                    alt={`Image ${colorVariantImage}`}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </Link>
    </div>
  );
};

export default CardProductAll;
