export interface IVoucher{
    _id?:string,
    code:string,
    discount:number,
    Usage_limits: number,
    start_date: number,
    end_date: number,
    status:boolean
}