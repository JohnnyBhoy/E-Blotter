import Modal from '@/Components/Modal';
import { useBlotterStore } from '@/utils/store/blotterStore';
import React, { useState } from 'react';
import ChartTop10PrevalentCrimes from '../Charts/ChartTop10PrevalentCrimes';

const TableBarangayDashboard = () => {
  // Global states
  const { hearing, settled, pending, referred, blotter } = useBlotterStore();

  // Local states
  const [showTop10, setShowTop10] = useState<boolean>(false);

  // Others blotters remarks
  const others = blotter - (hearing + settled + pending + referred);

  return (
    <div className="rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-2">
      <div className="flex flex-col">
        <div className="grid grid-cols-6 rounded-sm bg-orange-600 dark:bg-meta-4 sm:grid-cols-6">
          <div className="grid place-items-center px-2 py-3 border border-1 border-solid-slate-700">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
              Total Uploaded
            </h5>
          </div>
          <div className="grid place-items-center px-2 py-3 border border-1 border-solid-slate-700">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
              Amicably Settled
            </h5>
          </div>
          <div className="grid place-items-center px-2 py-3 border border-1 border-solid-slate-700">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
              Pending
            </h5>
          </div>
          <div className="grid place-items-center px-2 py-3 border border-1 border-solid-slate-700">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
              For Hearing
            </h5>
          </div>
          <div className="grid place-items-center px-2 py-3 border border-1 border-solid-slate-700">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
              Referred to PNP
            </h5>
          </div>
          <div className="grid place-items-center px-2 py-3 border border-1 border-solid-slate-700">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
              Others
            </h5>
          </div>
        </div>

        <div
          className="grid grid-cols-6 sm:grid-cols-6 border-b border-stroke dark:border-strokedark">
          <div className="flex items-center justify-center p-2.5 xl:p-3 border border-1 border-solid border-slate-700">
            <p className="text-black dark:text-white">
              {blotter < 1000 ? blotter : `${(blotter / 1000)?.toFixed(1)}K`}
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-3 border border-1 border-solid border-slate-700">
            <p className="text-black dark:text-white">
              {settled < 1000 ? settled : `${(settled / 1000)?.toFixed(1)}K`}
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-3 border border-1 border-solid border-slate-700">
            <p className="text-black dark:text-white">
              {pending < 1000 ? pending : `${(pending / 1000)?.toFixed(1)}K`}
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-3 border border-1 border-solid border-slate-700">
            <p className="text-black dark:text-white">
              {hearing < 1000 ? hearing : `${(hearing / 1000)?.toFixed(1)}K`}
            </p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-3 border border-1 border-solid border-slate-700">
            <p className="text-black dark:text-white">
              {referred < 1000 ? referred : `${(referred / 1000)?.toFixed(1)}K`}
            </p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-3 border border-1 border-solid border-slate-700">
            <p className="text-black dark:text-white">
              {others < 1000 ? others : `${(others / 1000)?.toFixed(1)}K`}
            </p>
          </div>
        </div>
      </div>

      <Modal show={showTop10} onClose={() => setShowTop10(false)} maxWidth='4xl'>
        <ChartTop10PrevalentCrimes />
      </Modal>
    </div>
  );
};

export default TableBarangayDashboard;
