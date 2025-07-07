
import { useEffect } from 'react';
import { initializeStorage } from '../utils/storage';
import '../styles/globals.css';
import '../styles/Home.module.css'; 

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initializeStorage();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;