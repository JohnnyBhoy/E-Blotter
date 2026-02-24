import { useBlotterStore } from '@/utils/store/blotterStore';
import { Link } from '@inertiajs/react';
import React from 'react';
import { Search, Bell, User, Menu, X } from 'react-bootstrap-icons';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const LogoIcon = '/images/logo/logo-icon.svg';
  const { blotter } = useBlotterStore();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white/80 dark:bg-boxdark/80 backdrop-blur-xl shadow-xs dark:shadow-sm transition-all duration-300">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="group relative z-50 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 lg:hidden"
          >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${props.sidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 my-1 ${props.sidebarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${props.sidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          {/* <!-- Logo --> */}
          <Link className="flex items-center gap-3 group" href="/">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white dark:bg-boxdark rounded-xl p-2">
                <img src={LogoIcon} alt="Logo" className="w-8 h-8" />
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                E-Blotter
              </h1>
              <p className="text-xs text-gray-500 dark:text-bodydark">Digital Crime Reporting</p>
            </div>
          </Link>
          {/* <!-- Logo --> */}
        </div>

        {/* <!-- Search Bar --> */}
        <div className="hidden sm:block flex-1 max-w-md mx-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-bodydark group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Search incidents, records..."
                className="w-full bg-gray-50 dark:bg-graydark/50 border border-gray-200 dark:border-strokedark rounded-full pl-12 pr-4 py-2.5 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-bodydark focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
        {/* <!-- Search Bar --> */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* <!-- Dark Mode Switcher --> */}
          <div className="relative">
            <DarkModeSwitcher />
          </div>
          {/* <!-- Dark Mode Switcher --> */}

          {/* <!-- Notification Area --> */}
          <div className="relative">
            <button className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-graydark/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105">
              <Bell className="w-5 h-5 text-gray-600 dark:text-bodydark group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              {blotter?.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
          {/* <!-- Notification Area --> */}

          {/* <!-- User Area --> */}
          <div className="relative">
            <DropdownUser />
          </div>
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
