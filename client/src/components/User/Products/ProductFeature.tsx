import ButtonSeeMore from "../Button/ButtonSeeMore";
import CardProductAll from "./CardProductAll";

const ProductFeature = () => {
  return (
    <section className="my-5">
      <h2 className="text-base md:text-xl lg:text-2xl font-semibold uppercase product-feature flex items-center gap-2">
        Sản phẩm nổi bật
      </h2>
      <div className="flex flex-wrap gap-[25px] my-[25px]">
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
        <CardProductAll />
      </div>
      <ButtonSeeMore link="/product-feature" />
    </section>
  );
};

export default ProductFeature;
