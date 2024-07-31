import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTopBarangay = ({ datas }: { datas: any }) => {

  // Local states
  const [year, setYear] = useState(1);
  const [view, setView] = useState(1);

  const barangays = datas?.map((item: any) => item?.name);
  const blotterCounts = datas?.map((item: any) => item?.count);

  // Get the max count
  let maxCount = datas?.reduce((max: number, obj: any) => obj?.count > max ? obj?.count : max, -Infinity);

  const options: ApexOptions = {
    colors: ['#80CAEE'],
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
              columnWidth: '50%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '50%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: barangays,
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
        data: blotterCounts,
      },
    ],
  });

  useEffect(() => {
    setState({
      ...state, series: [{
        name: 'Blotter',
        data: blotterCounts,
      },]
    });
  }, [year]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top 10 Barangay with most Blotter Incidents
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="#"
              id="#"
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value={1} className='dark:bg-boxdark'>2024</option>
              <option value={2} className='dark:bg-boxdark'>2023</option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2" />
          </div>

          <div className="relative z-20 inline-block ml-3">
            <select
              name="#"
              id="#"
              onChange={(e) => setView(parseInt(e.target.value))}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value={1} className='dark:bg-boxdark'>Chart</option>
              <option value={2} className='dark:bg-boxdark'>Table</option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div>
        {view == 1
          ? <div id="chartTwo" className="-ml-5 -mb-9">
            <ReactApexChart
              options={options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
          : <TopBarangayTable datas={datas} />
        }

      </div>
    </div>
  );
};

export default ChartTopBarangay;

const TopBarangayTable = ({ datas }: { datas: any }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base ml-3">
              No.
            </h5>
          </div>

          <div className="p-2.5 xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base ml-3">
              Barangay ID
            </h5>
          </div>

          <div className="p-2.5 xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Barangay
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Blotter Count
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {datas.map((item: any, key: number) => (
          <div
            className={`grid grid-cols-5 sm:grid-cols-5 border-b border-stroke dark:border-strokedark`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-1 w-6">
              <p className="hidden text-black dark:text-white sm:block text-center ml-6">
                {key + 1}
              </p>
            </div>
            <div className="flex items-center gap-3 p-2.5 xl:p-1 w-1/4">
              <p className="hidden text-black dark:text-white sm:block text-center ml-6">
                {item?.id}
              </p>
            </div>
            <div className="flex items-center gap-3 p-2.5 xl:p-1">
              <p className="hidden text-black dark:text-white sm:block">
                Barangay {item.name}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-1">
              <p className="text-meta-5">{item.count}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-1">
              <button className='text-xs bg-blue-400 text-white rounded-3xl px-4 py-1 hover:bg-blue-600'>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
