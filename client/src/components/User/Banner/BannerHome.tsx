import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation,Autoplay } from "swiper/modules";

const BannerHome = () => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={
            {
                delay: 2500,
                disableOnInteraction:false
            }
        }
        navigation={true}
        modules={[Pagination, Navigation,Autoplay]}
        className="mySwiper max-h-[265px] w-full lg:w-[75%] h-full rounded-lg"
      >
        <SwiperSlide>
            <img src="../../../src/assets/images/banner-polo-99k.png" alt="banner-polo-99k" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/banner-polo-99k.png" alt="banner-polo-99k" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/banner-polo-99k.png" alt="banner-polo-99k" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/banner-polo-99k.png" alt="banner-polo-99k" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/banner-polo-99k.png" alt="banner-polo-99k" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default BannerHome;
