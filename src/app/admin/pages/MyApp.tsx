import { AppProps } from 'next/app';
import Sidebar from '../components/SideBar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
