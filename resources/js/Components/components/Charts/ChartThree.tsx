import { useBlotterStore } from '@/utils/store/blotterStore';
import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
    toolbar: {
      show: true,
    },
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#B6B6B7'],
  labels: ['For Hearing', 'Amicable Settled', 'Reffered to PNP', 'Pending', 'Others'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '69%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const { blotter, hearing, settled, pending, referred } = useBlotterStore();
  const hearingPercentage = Math.ceil(hearing * 100 / blotter);
  const settledPercentage = Math.ceil(settled * 100 / blotter);
  const pendingPercentage = Math.ceil(pending * 100 / blotter);
  const referredPercentage = Math.ceil(referred * 100 / blotter);
  const others = Math.ceil((blotter - (hearing + settled + pending)) * 100 / blotter);

  const [state, setState] = useState<ChartThreeState>({
    series: [hearingPercentage, settledPercentage, pendingPercentage, referredPercentage, others],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: [hearingPercentage, settledPercentage, pendingPercentage, referredPercentage, others],
    }));
  };
  handleReset;

  return (
    <div className="sm:px-7.5 col-span-12 rounded-lg border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5 animate-slideinright">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Blotter Analytics
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name=""
              id=""
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="" className="dark:bg-boxdark">
                Yearly
              </option>
              <option value="" className="dark:bg-boxdark">
                Monthly
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-6">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full gap-8 text-sm font-medium text-black dark:text-white">
              <span>For Hearing</span>
              <span> {isNaN(hearingPercentage) ? 0 : hearingPercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-6">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full gap-8 text-sm font-medium text-black dark:text-white">
              <span> Amicably Settled </span>
              <span> {isNaN(settledPercentage) ? 0 : settledPercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/3 w-full px-3">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Reffered PNP </span>
              <span> {isNaN(referredPercentage) ? 0 : referredPercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/3 w-full px-7">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Pending </span>
              <span> {isNaN(pendingPercentage) ? 0 : pendingPercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/3 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#B6B6B7]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Others </span>
              <span> {isNaN(others) ? 0 : others}% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
