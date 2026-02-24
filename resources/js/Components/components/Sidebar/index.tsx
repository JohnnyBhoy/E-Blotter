import getUserRole from '@/utils/functions/getUserRole';
import { useLoginRegisterStore } from '@/utils/store/loginRegisterStore';
import { Link } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { Fingerprint, Gear, Grid1x2, List, X, House, FileText, People, BarChart, Shield, GeoAlt, ExclamationTriangle, ChevronDown } from 'react-bootstrap-icons';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  municipalities?: Array<{id: number, name: string}>;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, municipalities }: SidebarProps) => {
  // Local states
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [municipalitiesOpen, setMunicipalitiesOpen] = useState<boolean>(false);

  const role = getUserRole();

  // Debug logging
  console.log('Sidebar - Role:', role);
  console.log('Sidebar - Municipalities:', municipalities);

  const { setShowLogout } = useLoginRegisterStore();

  const pathname = window.location.pathname;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const Logo = '/images/logo/e-blotter.png';

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  // Navigation items based on role
  const getNavItems = () => {
    const isProvince = String(role) === 'province' || role === 2;
    const commonItems = [
      {
        href: isProvince ? '/province-dashboard' : '/dashboard',
        icon: House,
        label: 'Dashboard',
        active: pathname.includes('dashboard')
      }
    ];

    const roleStr = String(role);
    console.log('getNavItems - Role:', roleStr, 'Type:', typeof roleStr);
    console.log('getNavItems - Role comparison (roleStr === "province"):', roleStr === 'province');
    console.log('getNavItems - Role comparison (roleStr === "2"):', roleStr === '2');
    console.log('getNavItems - Municipalities:', municipalities);
    
    if (roleStr === '2' || roleStr === 'province') {
      console.log('Creating province navigation items');
      return [
        ...commonItems,
        {
          href: '#',
          icon: People,
          label: 'Municipal',
          active: false,
          isDropdown: true,
          dropdownItems: municipalities || []
        } as any,
        {
          href: '/analytics',
          icon: BarChart,
          label: 'Analytics',
          active: pathname.includes('analytics')
        }
      ];
    } else if (roleStr === '3' || roleStr === 'municipal') {
      return [
        ...commonItems,
        {
          href: '/incidents',
          icon: FileText,
          label: 'Incidents',
          active: pathname.includes('incidents')
        },
        {
          href: '/barangays',
          icon: People,
          label: 'Barangays',
          active: pathname.includes('barangays')
        }
      ];
    } else if (roleStr === 'station') {
      return [
        ...commonItems,
        {
          href: '/incidents',
          icon: FileText,
          label: 'Incidents',
          active: pathname.includes('incidents')
        },
        {
          href: '/reports',
          icon: ExclamationTriangle,
          label: 'Reports',
          active: pathname.includes('reports')
        }
      ];
    }

    console.log('Returning common items for role:', roleStr);
    return commonItems;
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen ${isCollapse ? 'w-20' : 'w-72'} flex-col overflow-y-hidden bg-white dark:bg-boxdark shadow-xs dark:shadow-sm duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-graydark dark:to-boxdark-2">
        <Link href={String(role) === 'province' || role === 2 ? '/province-dashboard' : '/dashboard'} className='flex items-center gap-3 group'>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-boxdark rounded-xl p-2 shadow-md">
              <img src={Logo} alt="Logo" className='h-8 w-8' />
            </div>
          </div>
          {!isCollapse && (
            <div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                E-Blotter
              </h3>
              <p className="text-xs text-gray-500 dark:text-bodydark">Digital System</p>
            </div>
          )}
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden relative group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gray-100 dark:bg-graydark/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600 dark:text-bodydark group-hover:text-red-500 transition-colors" />
          </div>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="flex flex-col justify-between h-full overflow-y-auto">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <div className="flex items-center justify-between mb-4">
              {!isCollapse ? (
                <>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider">
                    Main Menu
                  </h3>
                  <button
                    onClick={() => setIsCollapse(true)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsCollapse(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors mx-auto"
                >
                  <List size={20} />
                </button>
              )}
            </div>

            <ul className="mb-6 flex flex-col gap-2">
              {getNavItems().map((item: any, index) => (
                <li key={index}>
                  {item.isDropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => setMunicipalitiesOpen(!municipalitiesOpen)}
                        className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-white duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all w-full text-left ${
                          municipalitiesOpen ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : ''
                        }`}
                      >
                        <div className="relative text-gray-500 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <item.icon size={20} className="relative" />
                        </div>
                        {!isCollapse && (
                          <>
                            <span className="font-medium text-gray-900 dark:text-white flex-1">{item.label}</span>
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-300 ${municipalitiesOpen ? 'rotate-180' : ''}`}
                            />
                          </>
                        )}
                      </button>
                      
                      {/* Dropdown Menu */}
                      {municipalitiesOpen && !isCollapse && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-boxdark rounded-2xl shadow-xl dark:shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300 ease-out">
                          <div className="py-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-graydark scrollbar-track-transparent">
                            {item.dropdownItems?.map((municipality: any, mIndex: number) => (
                              <Link
                                key={mIndex}
                                href={`/municipal/${municipality.id}`}
                                className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:translate-x-1"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                  <span className="group-hover:font-semibold">{municipality.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-white duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all ${
                        item.active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : ''
                      } ${isCollapse ? 'justify-center' : ''}`}
                    >
                      <div className={`relative ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-300'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                        {item.active && (
                          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-lg blur-sm"></div>
                        )}
                        <item.icon size={20} className="relative" />
                      </div>
                      {!isCollapse && (
                        <>
                          <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                          {item.active && (
                            <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* <!-- Secondary Menu --> */}
          <div className="pt-4">
            {!isCollapse && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider mb-4">
                System
              </h3>
            )}
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/settings"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-white duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-graydark/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all ${isCollapse ? 'justify-center' : ''}`}
                >
                  <div className="relative text-gray-500 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                    <Gear size={20} />
                  </div>
                  {!isCollapse && (
                    <span className="font-medium text-gray-900 dark:text-white">Settings</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* <!-- User Info Footer --> */}
        {!isCollapse && (
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-graydark dark:to-boxdark-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                {String(role).charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {String(role)} Admin
                </p>
                <p className="text-xs text-gray-500 dark:text-white">
                  Online
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
