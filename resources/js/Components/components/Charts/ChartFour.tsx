import incidentTypes from '@/utils/data/incidentTypes';
import getIncidentType from '@/utils/functions/getIncidentType';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ChevronBarDown, ChevronDown } from 'react-bootstrap-icons';

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartFour = ({ monthlyIncidents }: { monthlyIncidents: any }) => {

  // Local states
  const [week, setweek] = useState(1);
  const [view, setView] = useState(1);
  const [show, setshow] = useState(false);
  const [showId, setshowId] = useState(0);

  const monthlyIncidentCount = monthlyIncidents?.map((count: any) => count?.count);
  const monthlyIncidentType = monthlyIncidents?.map((incident: any) => incident?.incident_type);

  // Get the total incidents this month
  const totalIncidents = monthlyIncidents?.reduce((total: number, obj: any) => total + obj?.count, 0);

  // Get the max count
  let maxCount = monthlyIncidents?.reduce((max: number, obj: any) => obj?.count > max ? obj?.count : max, -Infinity);

  const options: ApexOptions = {
    colors: ['#69D8D1'],
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
        columnWidth: '70%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: true,
    },

    xaxis: {
      categories: monthlyIncidentType,
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
        name: 'Recorded',
        data: monthlyIncidentCount,
      },
    ],
  });

  useEffect(() => {
    setState({
      ...state, series: [{
        name: 'Recorded',
        data: monthlyIncidentCount,
      },]
    });
  }, [week]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark w-full">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Yearly Incidents  Reports <small className='text-xs'>(Hover number buttons to view incident description)</small>
          </h4>
        </div>

        <div className="flex gap-3">
          <div>
            <div className="relative z-20 inline-block flex gap-24" >
              <h4 className='text-sm mt-2'><b>{totalIncidents}</b> Incidents Recorded</h4>
              <select
                name="#"
                id="#"
                onChange={(e) => setweek(parseInt(e.target.value))}
                className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              >
                <option value={1} className='dark:bg-boxdark'>This Year</option>
                <option value={2} className='dark:bg-boxdark'>Last Year</option>
              </select>
              <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="relative z-20 inline-block flex gap-24" >
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

      </div>

      <div>
        {view === 1
          ? <>
            <div className="border border-solid border-slate-300 p-2">
              <div className="flex flex-wrap space-x-6">
                {incidentTypes?.sort((a: any, b: any) => a.id - b.id)?.map((type) => (
                  <div key={type?.id}>
                    <IncidentButtons
                      type={type}
                      show={show}
                      showId={showId}
                      setshow={setshow}
                      setshowId={setshowId}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div id="chartTwo" className="-ml-5 -mb-9">
              <ReactApexChart
                options={options}
                series={state.series}
                type="bar"
                height={350}
              />
            </div>
          </>
          : <Table datas={monthlyIncidents} />
        }

      </div>
    </div >
  );
};

export default ChartFour;

const IncidentButtons = ({ type, show, showId, setshow, setshowId }:
  { type: any; show: boolean, showId: number; setshow: CallableFunction; setshowId: CallableFunction }) => {

  return (
    <>
      <button className={`z-20 mt-[-2rem] absolute bg-blue-400 text-white px-2 rounded-3xl text-xs py-1 ${show && showId == type?.id ? '' : 'hidden'}`}>
        {type.value}
      </button>
      <button
        className="relative z-10 bg-slate-500 text-white rounded-full w-[1.5rem] text-xs p-1"
        onMouseEnter={() => { setshow(true); setshowId(type?.id) }}
        onMouseLeave={() => { setshow(false); setshowId(0) }}
      >
        {type.id}
      </button>
    </>
  )
}


const Table = ({ datas }: { datas: any }) => {
  const [limit, setLimit] = useState<number>(10);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

      <div className="flex flex-col justify-between">
        <div className="flex justify-between rounded-sm bg-gray-2 dark:bg-meta-4">

          <div className="p-2.5 xl:p-2 w-full">
            <h5 className="text-sm font-medium uppercase xsm:text-base ml-3">
              Incident Type
            </h5>
          </div>

          <div className="p-2.5 xl:p-2 mr-16">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Entries
            </h5>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-1">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {datas
          ?.sort((a: any, b: any) => b.count - a.count)
          ?.slice(0, limit)
          ?.map((item: any, key: number) => (
            <div
              className={`flex justify-between border-b border-stroke dark:border-strokedark`}
              key={key}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-1 w-full">
                <p className="hidden text-black text-sm dark:text-white sm:block ml-3">
                  {getIncidentType(parseInt(item.incident_type))}
                </p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-1 w-1/4">
                <p className="text-meta-5 text-sm">{item.count}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-1">
                <button className='text-xs bg-blue-400 text-white rounded-3xl px-4 py-1 hover:bg-blue-600'>
                  View
                </button>
              </div>
            </div>
          ))}
      </div>

      <h6
        className='flex cursor-pointer hover:font-bold justify-end gap-2 p-2 text-sm'
        onClick={() => setLimit(limit + 10)}
      >
        See more <ChevronDown className='mt-1' />
      </h6>
    </div>
  )
}
