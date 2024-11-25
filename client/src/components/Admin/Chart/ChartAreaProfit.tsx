import React, { useState, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import type { ChartOptions, ChartSeries } from "./types";
import instance from "../../../instance/instance";

type TimelinePeriod =
  | "one_day"
  | "one_month"
  | "six_months"
  | "one_year"
  | "last_year"
  | "ytd"
  | "all";

interface TimelineButton {
  label: string;
  value: TimelinePeriod;
  startDate: string;
  endDate: string;
}

const ChartAreaProfit: React.FC = () => {
  const [dataDateFilter, setDataDateFilter] = useState<TimelineButton[]>([])
  const [data, setData] = useState<string[]>([])
  
  useEffect(() => {
    (async()=>{
      try {
        const {data}=await instance.get('thong-ke/ngay-thong-ke')
        console.log(data)
        setDataDateFilter(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    (async ()=>{
      try {
        const {data:{data:response}}=await instance.get('thong-ke/doanh-thu')
        setData(response)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])


  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const chartSeries: ChartSeries[] = [
    {
      name: "Đơn hàng",
      data: data.map(([timestamp, value]) => [
        timestamp + 7 * 60 * 60 * 1000,
        value,
      ]),
    },
  ];

  const [selection, setSelection] = useState<TimelinePeriod>("one_month");

  const chartOptions: ChartOptions = useMemo(() => {
    const selectedTimeline = dataDateFilter.find(
      (btn) => btn.value === selection
    );

    return {
      chart: {
        id: "area-datetime",
        type: "area",
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
        toolbar: {
          export: {
            csv: {
              filename: "bieu_do_doanh_thu",
              columnDelimiter: ",",
              headerCategory: "Ngày",
              headerValue: "value",
            },
            svg: {
              filename: undefined,
            },
            png: {
              filename: undefined,
            },
          },
        },
      },
      title: {
        text: "BIỂU ĐỒ THỐNG KÊ DOANH THU",
      },
      colors: ["#ff9900"],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      xaxis: {
        type: "datetime",
        min: selectedTimeline
          ? new Date(selectedTimeline.startDate).getTime()
          : undefined,
        max: selectedTimeline
          ? new Date(selectedTimeline.endDate).getTime()
          : undefined,
        tickAmount: 6,
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `${formatNumber(value)}`,
        },
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: (value: number) => `${formatNumber(value)} VNĐ`,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    };
  }, [selection]);

  const updateData = (timeline: TimelinePeriod): void => {
    setSelection(timeline);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 col-span-8">
      <div className="mb-4 space-x-2">
        {dataDateFilter.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => updateData(value)}
            className={`px-3 py-1 rounded ${
              selection === value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ChartAreaProfit;
