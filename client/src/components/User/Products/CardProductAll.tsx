const CardProductAll = () => {
  return (
    <div className="min-h-[354px] group max-w-[220px] w-full bg-util rounded-lg overflow-hidden shadow-[0px_1px_4px_0px_rgba(255,_138,_0,_0.25)] cursor-pointer">
      <div className="relative z-40">
        <img
          src="../../../../src/assets/images/product-image.png"
          alt="product-image"
        />
        <div className="absolute top-2 right-2 z-30 text-primary/70 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
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
        <div className="bg-primary/25 absolute top-0 z-40 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer ">
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-util p-2 rounded-full hover:cursor-pointer text-primary transition-all">
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
        </div>
      </div>
      <div className="flex justify-center gap-2 -mt-3.5 z-50 relative">
        <span className="p-3 rounded-full bg-util border border-primary"></span>
        <span className="p-3 rounded-full bg-primary border border-primary"></span>
        <span className="p-3 rounded-full bg-secondary border border-primary"></span>
      </div>
      <div className="px-5 space-y-2">
        <p className="line-clamp-1 mt-4 font-medium text-sm  md:text-base">
          Áo Polo Bo Dệt Sọc Đẹp Như Cô Gái Mới Lớn
        </p>
        <div className="flex gap-2 text-sm justify-center">
          <span className="line-through">450.000 Đ</span>
          <span className="text-primary font-medium">300.000 Đ</span>
        </div>
      </div>
    </div>
  );
};

export default CardProductAll;
