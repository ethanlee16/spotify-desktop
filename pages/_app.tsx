import "../styles/global.css";

import { SWRConfig } from "swr";
import fetch from "unfetch";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (...args: [RequestInfo, RequestInit?]) =>
          fetch(...args).then((res: Response) => res.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
