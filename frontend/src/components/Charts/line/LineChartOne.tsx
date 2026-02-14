import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type ChartData = {
  dates: string[];
  penjualan: number[];
  laba: number[];
};

export default function LineChartOne({ data }: { data?: ChartData }) {
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories:
        data?.dates?.map((date) => {
          const d = new Date(date);
          return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
        }) || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Penjualan",
      data: data?.penjualan || [],
    },
    {
      name: "Laba Bersih",
      data: data?.laba || [],
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-250">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
