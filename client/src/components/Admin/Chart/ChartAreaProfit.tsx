import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import type { ChartOptions, ChartSeries } from "./types";

type TimelinePeriod = "one_month" | "six_months" | "one_year" | "ytd" | "all";

interface TimelineButton {
  label: string;
  value: TimelinePeriod;
  startDate: string;
  endDate: string;
}

const TIMELINE_BUTTONS: TimelineButton[] = [
  {
    label: "1M",
    value: "one_month",
    startDate: "31 Oct 2024",
    endDate: "16 Nov 2024",
  },
  {
    label: "6M",
    value: "six_months",
    startDate: "27 Sep 2012",
    endDate: "27 Feb 2013",
  },
  {
    label: "1Y",
    value: "one_year",
    startDate: "27 Feb 2012",
    endDate: "27 Feb 2013",
  },
  {
    label: "YTD",
    value: "ytd",
    startDate: "01 Jan 2013",
    endDate: "27 Feb 2013",
  },
  {
    label: "ALL",
    value: "all",
    startDate: "23 Jan 2012",
    endDate: "27 Feb 2013",
  },
];

const formatNumber = (num) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

const chartSeries: ChartSeries[] = [
  {
    data: [
      [1730443426000, 665000],
      [1730444081000, 1100000],
      [1730462316000, 725000],
      [1730472691000, 1679998],
      [1730472903000, 1350000],
      [1730483440000, 300000],
      [1730483843000, 200000],
      [1730541954000, 200000],
      [1730558556000, 500000],
      [1730749737000, 550000],
      [1730749830000, 750000],
      [1730789259000, 500000],
      [1730789276000, 250000],
      [1730789290000, 250000],
      [1730789323000, 250000],
      [1730988931000, 500000],
      [1730988937000, 600000],
      [1731842272000, 500000],
      [1731845377000, 550000],
    ],
  },
];

const ChartAreaProfit: React.FC = () => {
  const [selection, setSelection] = useState<TimelinePeriod>("one_year");

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
          formatter: (value) => formatNumber(value),
        },
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: (value) => formatNumber(value),
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
