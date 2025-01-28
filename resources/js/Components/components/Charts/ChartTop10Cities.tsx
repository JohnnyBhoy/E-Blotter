import colors from '@/utils/data/chartColors';
import getCity from '@/utils/functions/getCity';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTop10Cities = ({ cities }: { cities: any }) => {
  console.log('cities :', cities);

  const city = cities?.map((city: any) => getCity(city.cityCode));
  const blotterPerCity = cities?.map((city: any) => city.noOfBlotters);

  // Get the max rank
  let maxCount = Math.max(...blotterPerCity);
  const [state, setState] = React.useState({

    series: [{
      data: blotterPerCity
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
            console.log(chart, w, e.target)
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: city,
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    },


  });
  return (
    <div className="col-span-12 rounded-lg border border-slate-300 bg-white p-7.5 shadow-sm dark:border-strokedark dark:bg-boxdark xl:col-span-12 w-full">
      <div className="justify-between gap-4 sm:flex">
        <div>
          <h3 className="font-bold text-black dark:text-white">
            Municipalities Blotter Count
          </h3>
        </div>
      </div>

      <div>
        <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartTop10Cities;