import { useEffect } from 'react'
//import { useLocation } from 'react-router-dom'

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const location = window.location;

  useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null; // This component doesn't render anything
};

export default PageTitle;
