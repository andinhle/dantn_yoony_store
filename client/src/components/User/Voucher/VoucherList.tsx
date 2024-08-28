import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Pagination } from "swiper/modules";

const VoucherList = () => {
  const vouchers = [
    {
      name: "Voucher 50K",
      desc: "Giảm 50k cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 30K",
      desc: "Giảm 30k cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 70K",
      desc: "Giảm 100K cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 50K",
      desc: "Giảm 100K cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
  ];
  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={20}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      loop={true}
      modules={[Pagination, Autoplay]}
      className="mySwiper"
      breakpoints={{
        320: {
            slidesPerView: 1,
        },
        640: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        }
      }}
    >
      {vouchers.length > 0 &&
        vouchers.map((voucher, index) => {
          return (
            <SwiperSlide className="py-2 px-0.5 hover:cursor-pointer">
              <div
                key={index + 1}
                className="flex gap-5 justify-center items-center shadow-[0px_0px_4px_0px_rgba(255,_153,_0,_0.50)] bg-util rounded-lg py-2.5"
              >
                <div>
                  <div className="space-y-[15px]">
                    <h5 className="text-lg font-medium">{voucher.name}</h5>
                    <span className="block font-light">{voucher.desc}</span>
                  </div>
                  <span className="mt-5 block text-[#848484] text-sm">
                    {voucher.timeEnd}
                  </span>
                </div>
                <div className="border h-[80px] border-dashed border-primary/50 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    className="absolute -top-[28px] -left-2.5 rounded-full"
                  >
                    <g filter="url(#filter0_i_489_1164)">
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="#fff"
                        transform="rotate(180 10 10)"
                      ></circle>
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_489_1164"
                        width="20"
                        height="22"
                        x="0"
                        y="-2"
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                      >
                        <feFlood
                          floodOpacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feBlend
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        ></feBlend>
                        <feColorMatrix
                          in="SourceAlpha"
                          result="hardAlpha"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        ></feColorMatrix>
                        <feOffset dy="-2"></feOffset>
                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          k2="-1"
                          k3="1"
                          operator="arithmetic"
                        ></feComposite>
                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.540816 0 0 0 0 0.00177409 0 0 0 0.25 0"></feColorMatrix>
                        <feBlend
                          in2="shape"
                          result="effect1_innerShadow_489_1164"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    className="absolute -bottom-[27px] -left-2.5 rounded-full"
                  >
                    <g filter="url(#filter0_i_489_1162)">
                      <circle cx="10" cy="10" r="10" fill="#fff"></circle>
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_489_1162"
                        width="20"
                        height="22"
                        x="0"
                        y="0"
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                      >
                        <feFlood
                          floodOpacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feBlend
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        ></feBlend>
                        <feColorMatrix
                          in="SourceAlpha"
                          result="hardAlpha"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        ></feColorMatrix>
                        <feOffset dy="2"></feOffset>
                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          k2="-1"
                          k3="1"
                          operator="arithmetic"
                        ></feComposite>
                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.540816 0 0 0 0 0.00177409 0 0 0 0.25 0"></feColorMatrix>
                        <feBlend
                          in2="shape"
                          result="effect1_innerShadow_489_1162"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </div>
                <div className="">
                  <button className="bg-primary py-2 px-[15px] text-util rounded-md block">
                    Lưu Mã
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default VoucherList;
