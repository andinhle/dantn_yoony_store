import { IAttributeValue } from "./IAttributeValue";

export interface IVariants{
    id?:number,
    price:number,
    sale_price?:number,
    end_sale?:string,
    image:string,
    attribute_values:IAttributeValue[]
}


