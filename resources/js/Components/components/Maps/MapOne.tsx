import { PageProps } from '@/Pages/types';
import React from 'react';

const MapOne = ({ auth, level = 'Barangay' }: PageProps<({ level: string })>) => {

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        {level} Map
      </h4>
      <iframe
        title="Bugasong Antique"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38239.69376125766!2d122.11138526368602!3d11.09635931631053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33afb7416ea24615%3A0x2264c6a82877d428!2sBugasong%2C%20Antique!5e1!3m2!1sen!2sph!4v1731371309881!5m2!1sen!2sph"
        width="100%"
        height="92%"
        className="border:0;"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
};

export default MapOne;
