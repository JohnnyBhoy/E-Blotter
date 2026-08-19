import getUserRole from '@/utils/functions/getUserRole';
import { useLoginRegisterStore } from '@/utils/store/loginRegisterStore';
import { Link } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { Buildings, CaretDownFill, ClipboardCheck, Fingerprint, Gear, Grid1x2, GeoAlt, List, People, PinMap, X } from 'react-bootstrap-icons';
import type { Icon } from 'react-bootstrap-icons';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

type MenuItem = {
  label: string;
  href: string;
  icon: Icon;
  /** Rendered as a collapsible group. The parent href is the first child. */
  children?: { label: string; href: string }[];
};

/**
 * Every level of the chain has its own dashboard and its own blotter list.
 * Linking one role at another role's route is a dead link: the matching Is*
 * middleware bounces the user back to `/`. Keep this in step with the role
 * groups in routes/web.php.
 */
const MENUS_BY_ROLE: Record<number, MenuItem[]> = {
  // Super admin
  1: [
    { label: 'Dashboard', href: '/admin-dashboard', icon: Grid1x2 },
    { label: 'Blotters', href: '/blotter/admin-blotters', icon: Fingerprint },
    { label: 'Cities', href: '/admin-cities', icon: Buildings },
    { label: 'Barangays', href: '/admin-barangays', icon: People },
  ],
  // Barangay
  2: [
    { label: 'Dashboard', href: '/dashboard', icon: Grid1x2 },
    { label: 'New Blotter', href: '/blotter', icon: Fingerprint },
    { label: 'Blotters', href: '/blotter/blotters', icon: Fingerprint },
    {
      // These four routes existed but nothing linked to them, so the whole
      // case-disposition workflow was unreachable from the UI.
      label: 'Case Disposition',
      href: '/hearing',
      icon: ClipboardCheck,
      children: [
        { label: 'For Hearing', href: '/hearing' },
        { label: 'Pending', href: '/pending' },
        { label: 'Amicably Settled', href: '/settled' },
        { label: 'Referred to PNP', href: '/referred' },
      ],
    },
    { label: 'Incidents', href: '/barangay-incidents', icon: GeoAlt },
    { label: 'Puroks', href: '/barangay-puroks', icon: PinMap },
    { label: 'Map', href: '/map', icon: GeoAlt },
    { label: 'Officials', href: '/officials', icon: People },
  ],
  // Municipal / PNP station
  3: [
    { label: 'Dashboard', href: '/municipal-dashboard', icon: Grid1x2 },
    { label: 'Blotters', href: '/blotter/municipal-blotters', icon: Fingerprint },
  ],
  // Provincial
  4: [
    { label: 'Dashboard', href: '/province-dashboard', icon: Grid1x2 },
    { label: 'Blotters', href: '/blotter/province-blotters', icon: Fingerprint },
    { label: 'Cities', href: '/province-cities', icon: Buildings },
  ],
  // Regional
  5: [
    { label: 'Dashboard', href: '/region-dashboard', icon: Grid1x2 },
    { label: 'Blotters', href: '/blotter/region-blotters', icon: Fingerprint },
  ],
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // LOcal states
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  const role = getUserRole();
  const menuItems = MENUS_BY_ROLE[Number(role)] ?? MENUS_BY_ROLE[2];
  const dashboardHref = menuItems[0].href;

  const { setShowLogout } = useLoginRegisterStore();

  const pathname = window.location.pathname;

  // A submenu starts open when the current page lives inside it.
  const [openGroup, setOpenGroup] = useState<string | null>(
    menuItems.find((item) => item.children?.some((child) => child.href === pathname))?.label ?? null
  );

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

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen shrink-0 ${isCollapse ? 'w-[4.5rem]' : 'w-64'} flex-col overflow-y-hidden border-r border-stroke bg-white duration-300 ease-linear dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className={`flex items-center gap-3 py-5 ${isCollapse ? 'justify-center px-2' : 'justify-between px-5'}`}>
        <Link href={dashboardHref} className='flex items-center gap-3'>
          {isCollapse
            ? null
            : <><img src={Logo} alt="Logo" className='h-9 w-9 shrink-0' />
              <h3 className="font-bold text-2xl text-slate-900 dark:text-white">E-911</h3>
            </>}
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block text-slate-500 dark:text-bodydark1 lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="flex flex-col justify-between h-full overflow-y-auto">
        {/* <!-- Sidebar Menu --> */}
        <nav className={`py-2 ${isCollapse ? 'px-2' : 'px-3'}`}>
          {/* <!-- Menu Group --> */}
          <div>

            {isCollapse
              ? <List
                onClick={() => setIsCollapse(false)}
                className='mx-auto mb-3 cursor-pointer text-slate-500 hover:text-primary dark:text-bodydark1'
                size={24}
              />
              : <div className="mb-3 flex items-center justify-between px-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  MENU
                </h3>

                <X
                  className='cursor-pointer text-slate-400 hover:text-slate-600 dark:text-bodydark1'
                  size={22}
                  onClick={() => setIsCollapse(true)}
                />
              </div>
            }

            <ul className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const childHrefs = item.children?.map((child) => child.href) ?? [];
                const isActive = pathname === item.href || childHrefs.includes(pathname);
                const isOpen = openGroup === item.label;

                // Collapsed rail: groups fall back to a single link so the
                // narrow strip never has to render a submenu.
                if (isCollapse) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={`flex items-center justify-center rounded-md py-2.5 duration-300 ease-in-out dark:hover:bg-meta-4 ${isActive
                          ? 'bg-blue-50 text-primary dark:bg-meta-4 dark:text-white'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-bodydark1'
                          }`}
                      >
                        <Icon size={24} />
                      </Link>
                    </li>
                  );
                }

                if (item.children) {
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenGroup(isOpen ? null : item.label)}
                        className={`group relative flex w-full items-center gap-3 rounded-md py-2.5 px-3 font-medium duration-300 ease-in-out dark:hover:bg-meta-4 ${isActive
                          ? 'bg-blue-50 text-primary dark:bg-meta-4 dark:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-bodydark1'
                          }`}
                      >
                        <Icon size={24} className="shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <CaretDownFill
                          size={10}
                          className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isOpen ? (
                        <ul className="mt-1 flex flex-col gap-1 border-l border-stroke pl-3 ml-6 dark:border-strokedark">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`block rounded-md py-2 px-3 text-sm duration-300 ease-in-out dark:hover:bg-meta-4 ${pathname === child.href
                                  ? 'bg-blue-50 font-medium text-primary dark:bg-meta-4 dark:text-white'
                                  : 'text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-bodydark1'
                                  }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-md py-2.5 px-3 font-medium duration-300 ease-in-out dark:hover:bg-meta-4 ${isActive
                        ? 'bg-blue-50 text-primary dark:bg-meta-4 dark:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-bodydark1'
                        }`}
                    >
                      <Icon size={24} className="shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav >

        <div className={`pb-4 pt-2 ${isCollapse ? 'px-2' : 'px-3'}`}>
          {isCollapse
            ? <Link
              href="/settings"
              title="Account Settings"
              className={`flex items-center justify-center rounded-md py-2.5 duration-300 ease-in-out dark:hover:bg-meta-4 ${pathname === '/settings'
                ? 'bg-blue-50 text-primary dark:bg-meta-4 dark:text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-bodydark1'
                }`}
            >
              <Gear size={24} />
            </Link>
            : <Link
              href="/settings"
              className={`group relative flex items-center gap-3 rounded-md py-2.5 px-3 font-medium duration-300 ease-in-out dark:hover:bg-meta-4 ${pathname === '/settings'
                ? 'bg-blue-50 text-primary dark:bg-meta-4 dark:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-bodydark1'
                }`}
            >
              <Gear size={24} className="shrink-0" />
              Account Settings
            </Link>
          }
        </div>
      </div>
    </aside >
  );
};

export default Sidebar;
