import { useParams } from "react-router-dom"
import RatingProduct from "../../../components/User/Show/RatingProduct"

 const RatingProductAdmin = ()=>{
    const {slug} = useParams();
    return (
        <div>
            <RatingProduct slugProd = {slug}/>
        </div>
    )
 }
 export default RatingProductAdmin