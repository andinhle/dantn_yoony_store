import { useParams } from "react-router-dom";

const UserOrderDetail = () => {
  const { code_order } = useParams();
  console.log(code_order)
  return <div className="border border-[#f1f1f1] rounded-md p-4">
    
  </div>;
};

export default UserOrderDetail;
