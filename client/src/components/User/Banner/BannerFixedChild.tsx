import { Image } from "antd";

const BannerFixedChild = () => {

  return (
    <div className="hidden lg:max-w-[25%] w-full space-y-3 lg:flex flex-row lg:flex-col items-center">
      <Image.PreviewGroup>
        <Image
          className="object-cover rounded-lg w-full h-full max-h-[125px]"
          src="../../../src/assets/images/banner-mini1-yoony-store.svg"
          preview={{
            mask: "Xem",
            maskClassName: "text-md lg:text-lg",
          }}
        />
        <Image
          className="object-cover rounded-lg w-full h-full max-h-[125px]"
          src="../../../src/assets/images/banner-mini2-yoony-store.svg"
          preview={{
            mask: "Xem",
            maskClassName: "text-md lg:text-lg",
          }}
          
        />
        <Image
          className="object-cover rounded-lg w-full h-full max-h-[125px]"
          src="../../../src/assets/images/banner-mini3-yoony-store.svg"
          preview={{
            mask: "Xem",
            maskClassName: "text-md lg:text-lg",
          }}
        />
      </Image.PreviewGroup>
    </div>
  );
};

export default BannerFixedChild;