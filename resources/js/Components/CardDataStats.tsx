import { useForm } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  remark: number;
  routeTo: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  remark,
  routeTo,
  levelUp,
  levelDown,
  children,
}) => {


  // Redirect to blotter by case disposition
  const { data, setData, get } = useForm({
    remark: remark,
  });

  const submit = () => {
    get(route(routeTo));
  }

  return (
    <div className="rounded-lg border border-slate-300 bg-white px-6 py-2 shadow-sm dark:border-strokedark dark:bg-boxdark cursor-pointer hover:bg-slate-300">
      <form onClick={submit}>
        <div className="flex justify-between">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            {children}
          </div>

          <div className="">
            <h1 className='text-2xl text-black dark:text-white font-bold text-slate-700 dark:text-white'>
              {parseInt(total) < 1000 ? parseInt(total) : `${(parseInt(total) / 1000).toFixed(1)}k`}
            </h1>
          </div>
        </div>


        <div className="flex items-end justify-between">
          <div className='flex flex-row gap-2'>
            <span className="text-sm font-medium mt-1">{title}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardDataStats;
