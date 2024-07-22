import incidentTypes from '@/utils/data/incidentTypes';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartFour = ({ monthlyIncidents }: { monthlyIncidents: any }) => {

  // Local states
  const [week, setweek] = useState(1);
  const [show, setshow] = useState(false);
  const [showId, setshowId] = useState(0);

  const monthlyIncidentCount = monthlyIncidents?.map((count: any) => count?.count);
  const monthlyIncidentType = monthlyIncidents?.map((incident: any) => incident?.incident_type);

  // Get the total incidents this month
  const totalIncidents = monthlyIncidents?.reduce((total: number, obj: any) => total + obj?.count, 0);

  // Get the max count
  let maxCount = monthlyIncidents?.reduce((max: number, obj: any) => obj?.count > max ? obj?.count : max, -Infinity);

  const options: ApexOptions = {
    colors: ['#3C50E0'],
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
            Monthly Incidents  Reports <small className='text-xs'>(Hover number buttons to view incident description)</small>
          </h4>
        </div>
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
      </div>

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
    </div >
  );
};

export default ChartFour;

const IncidentButtons = ({ type, show, showId, setshow, setshowId }:
  { type: any; show: boolean, showId: number; setshow: CallableFunction; setshowId: CallableFunction }) => {

  return (
    <>
      <button className={`z-20 mt-[-2rem] absolute bg-green-500 text-white px-2 rounded-3xl text-xs py-1 ${show && showId == type?.id ? '' : 'hidden'}`}>
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