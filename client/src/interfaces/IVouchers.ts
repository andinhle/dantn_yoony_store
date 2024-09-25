export interface IVoucher{
    id?:number,
    code:string,
    discount:number,
    discount_type:number,
    usage_limit: string,
    min_order_value: number,
    max_order_value: number,
    start_date: string,
    end_date: string,
    status:boolean,
}