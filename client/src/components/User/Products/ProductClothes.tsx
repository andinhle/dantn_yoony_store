import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import ButtonSeeMore from "../Button/ButtonSeeMore";
import "swiper/css";
import "swiper/css/navigation";

const ProductClothes = () => {
  return (
    <section className="py-5">
      <h2 className="text-base md:text-xl lg:text-2xl font-medium uppercase product-clothes flex items-center gap-2">
        Quần Áo
      </h2>
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        freeMode={true}
        hashNavigation={true}
        navigation={true}
        modules={[FreeMode, Navigation, HashNavigation]}
        className="mySwiper my-5"
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3.3,
            spaceBetween: 10,
          },
          800: {
            slidesPerView: 3.5,
            spaceBetween: 10,
          },
          884: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 5,
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
      <ButtonSeeMore link="/product-clothes" />
    </section>
  );
};

export default ProductClothes;
