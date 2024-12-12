import { useParams } from "react-router-dom"

const StatisDetailProduct = () => {
    const {slug}=useParams()
    
  return (
    <div className="p-5 rounded-md min-h-screen bg-util">
        {slug}
    </div>
  )
}

export default StatisDetailProduct