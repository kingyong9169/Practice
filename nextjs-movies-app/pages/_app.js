import Layout from '../components/Layout';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <style jsx global>{`
        a {
          color: orange;
        }
      `}</style>
    </Layout>
  );
}

export default MyApp
