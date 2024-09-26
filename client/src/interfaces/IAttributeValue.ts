import { IAttribute } from "./IAttribute";

export interface IAttributeValue {
    id?: number,
    value?: string,
    attribute_id?:IAttribute
}

