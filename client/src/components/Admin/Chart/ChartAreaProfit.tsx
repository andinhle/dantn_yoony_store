import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import type { ChartOptions, ChartSeries } from "./types";

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

const TIMELINE_BUTTONS: TimelineButton[] = [
  {
    label: "1 Ngày",
    value: "one_day",
    startDate: "20 Nov 2024",
    endDate: "20 Nov 2024",
  },
  {
    label: "1 Tháng",
    value: "one_month",
    startDate: "01 Nov 2024",
    endDate: "30 Nov 2024",
  },
  {
    label: "6 Tháng",
    value: "six_months",
    startDate: "01 May 2024",
    endDate: "20 Nov 2024",
  },
  {
    label: "1 Năm",
    value: "one_year",
    startDate: "01 Jan 2024",
    endDate: "20 Nov 2024",
  },
  {
    label: "Năm trước",
    value: "last_year",
    startDate: "01 Jan 2023",
    endDate: "31 Dec 2023",
  },
  {
    label: "Tất cả",
    value: "all",
    startDate: "10 Jan 2024",
    endDate: "20 Nov 2024",
  },
];

const formatNumber = (num) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};
const result = [
  [1722445200000, 250000],
  [1725123600000, 300000],
  [1729530000000, 250000],
  [1731171600000, 500000],
  [1732035600000, 280000],
  [1732122000000, 800000],
  [1732554000000, 1250000],
];

const chartSeries: ChartSeries[] = [
  {
    name: "Đơn hàng",
    data: result.map(([timestamp, value]) => [
      timestamp + 7 * 60 * 60 * 1000,
      value,
    ]),
  },
];

const ChartAreaProfit: React.FC = () => {
  const [selection, setSelection] = useState<TimelinePeriod>("one_month");

  const chartOptions: ChartOptions = useMemo(() => {
    const selectedTimeline = TIMELINE_BUTTONS.find(
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
        {TIMELINE_BUTTONS.map(({ label, value }) => (
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
