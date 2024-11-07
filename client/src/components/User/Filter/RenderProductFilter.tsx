import { IProduct } from "../../../interfaces/IProduct";
import CardProductAll from "../Products/CardProductAll";
import GroupVariantsByColor from "../Show/GroupVariantsByColor";

type Props = {
  datas: IProduct[];
};
const RenderProductFilter = ({ datas }: Props) => {
  return (
    <div className=" space-y-5">
      <div>
        <button className="bg-primary text-util px-4 py-1.5 rounded-sm text-sm">
            Mới nhất
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {datas &&
          datas.map((data) => {
            const colorVariantsImages = GroupVariantsByColor(data?.variants);
            return (
              <div key={data?.id}>
                <CardProductAll
                  imageProduct={data?.images[0]}
                  nameProduct={data?.name}
                  colorVariantsImages={colorVariantsImages as []}
                  variants={data?.variants ?? []}
                  is_featured={data?.is_featured === 1 ? true : false}
                  is_good_deal={data?.is_good_deal === 1 ? true : false}
                  id_Product={data?.id as number}
                  category={data?.category?.slug as string}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RenderProductFilter;
