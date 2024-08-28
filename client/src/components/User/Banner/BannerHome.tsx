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
        className="mySwiper w-full md:h-full min-h-[200px] md:min-h-[225px] lg:min-h-[250px] rounded-lg col-span-7 md:col-span-5"
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
