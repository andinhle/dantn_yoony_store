import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import ButtonSeeMore from "../Button/ButtonSeeMore";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

const ProductGlasses = () => {
  return (
    <section className="py-10 flex flex-col lg:flex-row gap-5">
      {/* Phần slider sản phẩm */}
      <div className="lg:w-2/3 w-full">
        <h2 className="text-base md:text-xl lg:text-2xl font-medium uppercase text-center py-5">
          KÍNH THỜI TRANG NAM
        </h2>
        <div className="w-full">
          <Swiper
            slidesPerView={3.5}
            spaceBetween={20}
            freeMode={true}
            hashNavigation={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[FreeMode, Navigation, HashNavigation, Autoplay]}
            className="mySwiper my-5"
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3.5,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
          >
            {[...Array(9)].map((_, index) => (
              <SwiperSlide key={index} className="pb-1 px-0.5">
                <CardProductAll />
              </SwiperSlide>
            ))}
          </Swiper>
          <ButtonSeeMore link="" />
        </div>
      </div>

      {/* Hình ảnh bên phải */}
      <div className="lg:w-1/3 w-full group relative">
        <img
          src="../../../../src/assets/images/image-glasses.png"
          alt="image-glasses"
          className="w-full h-auto rounded-md"
        />
        <div className="absolute bg-custom-gradient-hover w-full h-full top-0 rounded-md bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer">
          <Link
            to={""}
            className="px-5 py-2.5 bg-util hover:bg-primary hover:text-util transition-all duration-300 rounded-lg absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-xl font-medium text-primary"
          >
            XEM THÊM
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGlasses;
