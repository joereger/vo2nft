import Navbar from '../Navbar';
import Demo from './components/demo/Demo';
import FeatureHighlights from './components/FeatureHighlights';
import FlexibleComponents from './components/FlexibleComponents';
import InnerPages from './components/innerPages/InnerPages';
import Intro from './components/Intro';
import MobileFriendly from './components/MobileFriendly';
import Footer from './Footer';

const Home = () => {
  return (
    <>
      <Navbar bg="dark"/>
      <Intro />
      <Demo />
      <FlexibleComponents />
      <InnerPages />
      <MobileFriendly />
      <FeatureHighlights />
      <Footer />
    </>
  )
};

export default Home;
