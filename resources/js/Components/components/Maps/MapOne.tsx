import { PageProps } from '@/Pages/types';
import GoogleMapReact from 'google-map-react';
import React from 'react';

const AnyReactComponent = ({ lat, lng, text }: { lat: number, lng: number; text: string }) => <div>{text}</div>;

const MapOne = ({ auth, level = 'Barangay' }: PageProps<({ level: string })>) => {

  const defaultProps = {
    center: {
      lat: auth.user.lat,
      lng: auth.user.lang
    },
    zoom: 15
  };

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        {level} Map
      </h4>
      <div style={{ height: '50vh', width: '100%' }} className='filter brightness-200'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent
            lat={auth.user.lat}
            lng={auth.user.lang}
            text={auth.user.name}
          />
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default MapOne;
