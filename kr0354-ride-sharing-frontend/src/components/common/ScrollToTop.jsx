import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component scrolls to the top of the page when navigating to a new route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
