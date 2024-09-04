import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  HashNavigation,
} from "swiper/modules";
import ButtonSeeMore from "../Button/ButtonSeeMore";
const ProductClothes = () => {
  return (
    <section className="my-5">
      <h2 className="text-base md:text-xl lg:text-2xl font-semibold uppercase product-feature flex items-center gap-2">
        Quần Áo
      </h2>
      {/* <div className="flex flex-wrap gap-[25px] my-[25px]">
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
      </div> */}
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        freeMode={true}
        hashNavigation={true}
        navigation={true}
        modules={[FreeMode, Navigation, HashNavigation]}
        className="mySwiper my-5"
      >
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
        <SwiperSlide className="pb-1 px-0.5">
            <CardProductAll />
        </SwiperSlide>
      </Swiper>
      <ButtonSeeMore link="/product-clothes" />
    </section>
  );
};

export default ProductClothes;
