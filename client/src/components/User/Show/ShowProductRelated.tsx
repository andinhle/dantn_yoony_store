import { IProduct } from "../../../interfaces/IProduct"

type Prop={
    related_products:IProduct[]
}
const ShowProductRelated = ({related_products}:Prop) => {
    console.log(related_products);
  return (
    <section>
        <h2>Sản phẩm bạn có thể thích</h2>

    </section>
  )
}

export default ShowProductRelated