import ChartAreaProfit from "../../../components/Admin/Chart/ChartAreaProfit"
import ChartPieOrder from "../../../components/Admin/Chart/ChartPieOrder"

const ChartAdmin = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
        <ChartAreaProfit />
        <ChartPieOrder />
    </div>
  )
}

export default ChartAdmin