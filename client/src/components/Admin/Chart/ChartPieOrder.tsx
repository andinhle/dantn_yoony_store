import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";

const ChartPieOrder = () => {
  return (
    <div className="bg-util col-span-4 p-5 rounded-md">
      {/* <Chart
        options={{
          chart: {
            type: "donut",
          },
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                }
              },
              startAngle: 0,
              endAngle: 360,
            }
          },
        }}
        series={[44, 55, 41, 17, 15]} 
        type="donut"
      /> */}
      <ReactApexChart
        options={{
          chart: {
            type: "donut",
          },
          plotOptions: {
            pie: {
              donut: {
                size: "70%",
                labels: {
                  show: true,
                },
              },
              startAngle: 0,
              endAngle: 360,
            },
          },
        }}
        series={[44, 55, 41, 17, 15]}
        type="donut"
      />
    </div>
  );
};

export default ChartPieOrder;
