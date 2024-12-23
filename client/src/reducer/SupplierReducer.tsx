import { ISupplier } from '../interfaces/ISupplier';


const SupplierReducer = (state:any,action:any) => {
    switch (action.type) {
        case "LIST":
            return action.payload
        case "ADD":
            return [action.payload,...state]
        case "UPDATE":
            return state.map((item:ISupplier)=>{
                if (item.id !== action.payload.id) {
                    return item
                }
                return action.payload
            })
        case "DELETE":
            return state.filter((item:ISupplier)=>{
                return item.id !== action.payload
            })
        default:
            break;
    }
}

export default SupplierReducer