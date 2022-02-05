import ParallaxMousemove from 'react-parallax-mousemove';
import ParallaxElement from './ParallaxElem';
import layer1 from '../../../img/demo/presentation/intro/layer01.png';
import layer2 from '../../../img/demo/presentation/intro/layer02.png';
import layer3 from '../../../img/demo/presentation/intro/layer03.png';
import layer4 from '../../../img/demo/presentation/intro/layer04.png';
import layer5 from '../../../img/demo/presentation/intro/layer05.png';
import layer6 from '../../../img/demo/presentation/intro/layer06.png';
import layer7 from '../../../img/demo/presentation/intro/layer07.png';
import layer8 from '../../../img/demo/presentation/intro/layer08.png';
import layer9 from '../../../img/demo/presentation/intro/layer09.png';
import bg from '../../../img/demo/presentation/intro/bg.jpg';

const Intro = () => (
    <section className="d-flex align-items-center position-relative bg-size-cover bg-position-center min-vh-100 overflow-hidden pt-6 pb-lg-5" style={{ backgroundImage: `url(${bg})` }}>
      <div className="container-fluid pt-4 pb-5 py-lg-5">
        <div className="row align-items-center py-3">
          <div className="col-xl-6 col-lg-5 d-flex justify-content-end">
            <div className="pt-2 mx-auto mb-5 mb-lg-0 ms-lg-0 me-xl-7 text-center text-lg-start" style={{maxWidth: '495px'}}>
              <h1 className="display-4 text-light pb-2">
                <span className="fw-light">Workouts to </span>NFTs. COMING SOON.
              </h1>
              <p className="h4 fw-light text-light opacity-70 line-height-base">Connect your endurance sports app and we'll create NFTs for your community to engage with.  You'll make royalties off of any downstream sales.</p>
              <a className="d-inline-flex align-items-center text-decoration-none pt-2 mt-4 mb-5" href="#demos" data-scroll>
                <span className="btn btn-icon rounded-circle border-light flex-shrink-0 px-3">
                  <i className="ai-arrow-down h4 text-light my-1"></i>
                </span>
                <span className="ms-3 text-light fw-medium">View Demos</span>
              </a>
              <hr className="hr-light mt-0 mb-5" />
              <div className="row">
                <div className="col-sm-4 mb-4 mb-sm-0">
                  <div className="h1 text-light mb-1">14</div>
                  <div className="h5 text-light fw-normal opacity-70 mb-2">Demo Homepages</div><span className="badge rounded-pill bg-success">More coming</span>
                </div>
                <div className="col-sm-4 mb-4 mb-sm-0">
                  <div className="h1 text-light mb-1">50+</div>
                  <div className="h5 text-light fw-normal opacity-70 mb-1">Flexible Components</div>
                </div>
                <div className="col-sm-4">
                  <div className="h1 text-light mb-1">47</div>
                  <div className="h5 text-light fw-normal opacity-70 mb-1">Inner Page Templates</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7 parallax-container">
            <ParallaxMousemove className="parallax" containerStyle={{
              maxWidth: '930px',
              transform: 'translate3d(0, 0, 0) rotate(0.0001deg)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              pointerEvents: 'none',
              }}
            >
              <ParallaxElement image={layer1} x={0.02} y={-0.02}/>
              <ParallaxElement image={layer2} index={2} x={0.04} y={-0.04}/>
              <ParallaxElement image={layer3} x={0.04} y={-0.04}/>
              <ParallaxElement image={layer4} index={3} x={0.03} y={-0.03}/>
              <ParallaxElement image={layer5} x={0.035} y={-0.035}/>
              <ParallaxElement image={layer6} index={4} x={0.045} y={-0.045}/>
              <ParallaxElement image={layer7} x={0.05} y={-0.05}/>
              <ParallaxElement image={layer8} x={0.05} y={-0.05}/>
              <ParallaxElement image={layer9} x={0.055} y={-0.055}/>
            </ParallaxMousemove>
          </div>
        </div>
      </div>
    </section>
);

export default Intro;
