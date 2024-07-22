import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo = ({ data }: { data: any }) => {

  // Local states
  const [week, setweek] = useState(1);
  const weeklyDataCount = week === 1 ? data?.slice(7, 15)?.map((count: any) => count.count) : data?.slice(0, 7)?.map((count: any) => count.count);
  const weeklyDataDay = week === 1 ? data?.slice(7, 15)?.map((day: any) => day.day) : data?.slice(0, 7)?.map((day: any) => day.day);

  console.log(weeklyDataDay);
  console.log(weeklyDataCount);
  console.log(data);

  // Get the max count
  let maxCount = data.reduce((max: number, obj: any) => obj.count > max ? obj.count : max, -Infinity);

  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: weeklyDataDay,
    },
    yaxis: {
      max: maxCount,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',

      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Blotter',
        data: weeklyDataCount,
      },
    ],
  });

  useEffect(() => {
    setState({
      ...state, series: [{
        name: 'Blotter',
        data: weeklyDataCount,
      },]
    });
  }, [week]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  console.log(data);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Blotter {week === 1 ? 'this' : 'last'} week
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="#"
              id="#"
              onChange={(e) => setweek(parseInt(e.target.value))}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value={1} className='dark:bg-boxdark'>This Week</option>
              <option value={2} className='dark:bg-boxdark'>Last Week</option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
