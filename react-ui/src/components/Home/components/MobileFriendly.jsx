import mobileScreen from '../../../img/demo/presentation/mobile-screens.jpg';
import qrCode from '../../../img/demo/presentation/qrcode.png';

const MobileFriendly = () => (
  <section className="bg-secondary py-5 py-md-6 py-lg-7">
    <div className="container py-3 py-lg-4">
      <div className="row align-items-center">
        <div className="col-md-6 mb-5 mb-md-0">
          <div className="mx-auto mx-md-0" style={{maxWidth: '525px'}}>
            <img className="d-block" src={mobileScreen} alt="Mobile screens" />
          </div>
        </div>
        <div className="col-md-6 text-center text-md-start">
          <h2 className="h1 mb-4"><span className='bg-faded-primary rounded text-primary px-3 py-2'>Mobile Friendly</span> Interface</h2>
          <p className="text-muted mb-5">Around based on advanced fully responsive Bootstrap grid. It looks great at any screen resolution and optimized for small touch screens. Around features 2 types of navigation for handeld devices and off-canvas sidebars that are easily accessible. All sliders used in the template have swipe support.</p>
          <div className="d-flex align-items-center justify-content-center justify-content-md-start">
            <img src={qrCode} alt="QR Code" width="120" />
            <div className="ps-3 ps-sm-4">
              <div className="text-nav text-start" style={{maxWidth: '175px'}}>Scan QR code to test on your device</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MobileFriendly;
