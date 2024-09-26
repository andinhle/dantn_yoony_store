import { IAttributeValue } from "./IAttributeValue";

export interface IVariants{
    id?:number,
    price:number,
    sale_price:number,
    quantity:number,
    image:string,
    attribute_values:IAttributeValue[]
}


