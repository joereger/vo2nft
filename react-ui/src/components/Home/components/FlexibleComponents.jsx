import { NavLink } from "react-router-dom";
import carousels from '../../../img/demo/presentation/icons/carousel.svg';
import gallery from '../../../img/demo/presentation/icons/gallery.svg';
import chart from '../../../img/demo/presentation/icons/chart.svg';
import play from '../../../img/demo/presentation/icons/play.svg';
import forms from '../../../img/demo/presentation/icons/forms.svg';
import review from '../../../img/demo/presentation/icons/review.svg';
import macBook from '../../../img/demo/presentation/macbook.png';

const FlexibleComponents = () => (
  <section className="bg-gradient py-5 py-md-6 py-lg-7">
    <div className="container-fluid py-3 py-lg-4 overflow-hidden">
      <div className="row align-items-center">
        <div className="col-xl-6 col-lg-5 d-flex justify-content-end mb-5 mb-lg-0">
          <div className="mx-auto ms-lg-0 me-xl-7 text-center text-lg-start" style={{maxWidth: '495px'}}>
            <h2 className="h1 text-light mb-4">Flexible <span className='bg-faded-light rounded px-3 py-2'>Components</span></h2>
            <p className="text-light opacity-70 mb-5">
              The complete UI Kit with over 50 modular and highly customizable components: Bootstrap + Around unique elements.
            </p>
            <div className="row mb-2 mx-n2">
              <div className="col-6 px-2 mb-3">
                <NavLink className="d-block border border-light rounded-3 pt-3 pb-4 px-3 text-center text-decoration-none" to="link">
                  <img className="d-inline-block opacity-60 mb-3" src={carousels} alt="Sliders &amp; Carousels" width="68" />
                  <h3 className="h6 text-light mb-0">Sliders &amp; Carousels</h3>
                </NavLink>
              </div>
              <div className="col-6 px-2 mb-3">
                <NavLink className="d-block border border-light rounded-3 pt-3 pb-4 px-3 text-center text-decoration-none" to="link">
                  <img className="d-inline-block opacity-60 mb-3" src={gallery} alt="Image / Video Gallery" width="45" />
                  <h3 className="h6 text-light mb-0">Image / Video Gallery</h3>
                </NavLink>
              </div>
              <div className="col-6 px-2 mb-3">
                <NavLink className="d-block border border-light rounded-3 pt-3 pb-4 px-3 text-center text-decoration-none" to="link">
                  <img className="d-inline-block opacity-60 mb-3" src={chart} alt="Line, Bar &amp; Pie Charts" width="39" />
                  <h3 className="h6 text-light mb-0">Line, Bar &amp; Pie Charts</h3>
                </NavLink>
              </div>
              <div className="col-6 px-2 mb-3">
                <NavLink className="d-block border border-light rounded-3 pt-3 pb-4 px-3 text-center text-decoration-none" to="link">
                  <img className="d-inline-block opacity-60 mb-3" src={play} alt="Video Popup &amp; Embed" width="44" />
                  <h3 className="h6 text-light mb-0">Video Popup &amp; Embed</h3>
                </NavLink>
              </div>
              <div className="col-6 px-2 mb-3">
                <NavLink className="d-block border border-light rounded-3 pt-3 pb-4 px-3 text-center text-decoration-none" to="link">
                  <img className="d-inline-block opacity-60 mb-3" src={forms} alt="Form Controls" width="42" />
                  <h3 className="h6 text-light mb-0">Form Controls</h3>
                </NavLink>
              </div>
              <div className="col-6 px-2 mb-3">
                <NavLink className="d-block border border-light rounded-3 pt-3 pb-4 px-3 text-center text-decoration-none" to="link">
                  <img className="d-inline-block opacity-60 mb-3" src={review} alt="Testimonials &amp; Reviews" width="46" />
                  <h3 className="h6 text-light mb-0">Testimonials &amp; Reviews</h3>
                </NavLink>
              </div>
            </div>
            <NavLink className="btn btn-success" to="link">View All Components</NavLink>
          </div>
        </div>
        <div className="col-xl-6 col-lg-7 d-flex justify-content-end pe-0">
          <NavLink className="d-block me-n3" to="link">
            <img className="d-block" src={macBook} alt="Components" />
          </NavLink>
        </div>
      </div>
    </div>
  </section>
);

export default FlexibleComponents;
