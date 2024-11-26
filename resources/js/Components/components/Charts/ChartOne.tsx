import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne = ({ lastYearBlotter, thisYearBlotter }: {
  lastYearBlotter: any[];
  thisYearBlotter: any[];
}) => {


  // Using Array.reduce to find maximum count in one line
  let maxCount = thisYearBlotter?.reduce((max, obj) => obj?.count > max ? obj?.count : max, -Infinity);
  let maxlastCount = lastYearBlotter?.reduce((max, obj) => obj?.count > max ? obj?.count : max, -Infinity);

  const options: ApexOptions = {

    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#80CAEE', '#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      toolbar: {
        show: true,
      },
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
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
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#80CAEE', '#3056D3'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: maxCount > maxlastCount ? maxCount : maxlastCount,
    },
  };

  // Initialize monthly data
  let defaultMonthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let defaultLastMonthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const date = new Date();
  const currentYear = date.getFullYear();

  // Get the last year blotter and store it in array
  thisYearBlotter?.map((item: any) => [...defaultMonthlyData, defaultMonthlyData[item.month - 1] = item.count]);
  lastYearBlotter?.map((item: any) => [...defaultLastMonthlyData, defaultLastMonthlyData[item.month - 1] = item.count]);

  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: `${currentYear - 1} Blotter`,
        data: defaultLastMonthlyData,
      },

      {
        name: `${currentYear} Blotter`,
        data: defaultMonthlyData,
      },
    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8 animate-fadeinleft">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Uploaded</p>
              <p className="text-sm font-medium">
                January - December {date.getFullYear()}
              </p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Prevalent Incidents</p>
              <p className="text-sm font-medium">
                January - December {date.getFullYear()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
