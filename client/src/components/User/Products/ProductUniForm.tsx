import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import ButtonSeeMore from "../Button/ButtonSeeMore";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

const ProductUniForm = () => {
  return (
    <section className="py-5 flex flex-col md:flex-row gap-5">
      <div className="w-full md:w-1/3 relative group flex-shrink-0">
        <img
          src="../../../../src/assets/images/image-uniform.png"
          alt="image-uniform"
          className="w-full rounded-md object-cover 
                   lg:h-auto"
        />
        <div className="absolute bg-custom-gradient-hover w-full h-full top-0 rounded-md bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer">
          <Link
            to={""}
            className="px-4 py-2 bg-util hover:bg-primary hover:text-util transition-all duration-300 rounded-md 
                 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
                 text-sm md:text-base lg:text-lg font-medium text-primary shadow-md"
          >
            XEM THÊM
          </Link>
        </div>
      </div>
      <div className="w-full md:w-2/3">
        <h2 className="text-base md:text-xl lg:text-2xl font-medium uppercase text-center py-5">
          ĐỒNG PHỤC POLO
        </h2>
        <div className="w-full">
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
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
                slidesPerView: 2.5,
                spaceBetween: 10,
              },
              884: {
                slidesPerView: 3.5,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
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
    </section>



  );
};

export default ProductUniForm;
