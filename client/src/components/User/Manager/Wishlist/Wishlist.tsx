import { useEffect, useState } from "react";
import instance from "../../../../instance/instance";
import { IProduct } from "../../../../interfaces/IProduct";
import CardProductAll from "../../Products/CardProductAll";
import GroupVariantsByColor from "../../Show/GroupVariantsByColor";

type ProductWishlist = {
  product: IProduct;
};


const Wishlist = () => {
  const [wishlists, setWishlists] = useState<ProductWishlist[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("list-wishlists");
        setWishlists(data.wishlists);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  console.log(wishlists)
  return (
    <div className="grid grid-cols-4 gap-4">
      {wishlists.map((data) => {
        console.log(data?.product?.variants)
        const colorVariantsImages = GroupVariantsByColor(data?.product?.variants);
        return (
          <CardProductAll
            imageProduct={data?.product?.images[0]}
            nameProduct={data?.product?.name}
            colorVariantsImages={colorVariantsImages as []}
            variants={data?.product?.variants ?? []}
            is_featured={data?.product?.is_featured === 1 ? true : false}
            is_good_deal={data?.product?.is_good_deal === 1 ? true : false}
            id_Product={data?.product?.id as number}
            category={data?.product?.category?.slug as string}
          />
        );
      })}
    </div>
  );
};

export default Wishlist;