import getIncidentType from '@/utils/functions/getIncidentType';
import { useBlotterStore } from '@/utils/store/blotterStore';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Download } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTop10PrevalentCrimes = () => {
  // Global state
  const { top10Cases } = useBlotterStore();

  // Local states
  const [year, setYear] = useState(1);
  const [view, setView] = useState(1);

  const barangays = top10Cases?.map((item: any) => getIncidentType(item?.incident_type)?.split("-")[1]);
  const blotterRanks = top10Cases?.map((item: any) => item?.count);

  // Get the max rank
  let maxCount = top10Cases?.reduce((max: number, obj: any) => obj?.count > max ? obj?.count : max, -Infinity);

  const options: ApexOptions = {
    colors: ['#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 500,
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
        data: blotterRanks,
      },
    ],
  });

  useEffect(() => {
    setState({
      ...state, series: [{
        name: 'Blotter',
        data: blotterRanks,
      },]
    });
  }, [year]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  const handleDownload = () => {
    setView(2);
    const table = document.getElementById('content-to-download');
    const ws = XLSX.utils.table_to_sheet(table); // Convert table to worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append worksheet to workbook

    // Generate a downloadable Excel file
    XLSX.writeFile(wb, 'Top 10 Prevalent Crimes.xlsx');
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top 10 Prevalent Crimes
          </h4>
        </div>
        <div>
          <div className="relative  z-20 inline-block mr-6">
            <div className="flex gap-2 cursor-pointer hover:font-bold" onClick={handleDownload}>
              <Download className='mt-1' /> Download
            </div>
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
              height={400}
            />
          </div>
          : <TopBarangayTable datas={top10Cases} />
        }

      </div>
    </div>
  );
};

export default ChartTop10PrevalentCrimes;

type Datas = {
  rank: number;
  incident_type: number;
  count: number;
}

const TopBarangayTable = ({ datas }: { datas: any }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table className='border p-2' id="content-to-download" >
        <tr className=''>
          <th className='p-2 bg-blue-500 text-white border border border-solid border-black'>Rank</th>
          <th className='p-2 bg-blue-500 text-white border border border-solid border-black'>Case / Incident Type</th>
          <th className='p-2 bg-blue-500 text-white border border border-solid border-black'>Total</th>
        </tr>
        <tbody>
          {datas?.map((item: Datas) => (
            <tr key={item?.rank}>
              <td className='px-2 py-1 border'>{item?.rank}</td>
              <td className='px-2 py-1 border'>{getIncidentType(item?.incident_type)}</td>
              <td className='px-2 py-1 border'>{item?.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
