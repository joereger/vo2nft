import businessConsulting from '../../../../img/demo/presentation/demos/business-consulting.jpg';
import shop from '../../../../img/demo/presentation/demos/shop-homepage.jpg';
import booking from '../../../../img/demo/presentation/demos/booking.jpg';
import creativeAgency from '../../../../img/demo/presentation/demos/creative-agency.jpg';
import webStudio from '../../../../img/demo/presentation/demos/web-studio.jpg';
import softwareLanding from '../../../../img/demo/presentation/demos/software-landing.jpg';
import gadgetLanding from '../../../../img/demo/presentation/demos/gadget-landing.jpg';
import mobileApp from '../../../../img/demo/presentation/demos/mobile-app.jpg';
import coworking from '../../../../img/demo/presentation/demos/coworking.jpg';
import eventLanding from '../../../../img/demo/presentation/demos/event-landing.jpg';
import templatePresentation from '../../../../img/demo/presentation/demos/template-presentation.jpg';
import marketingSeo from '../../../../img/demo/presentation/demos/marketing-seo.jpg';
import foodBlog from '../../../../img/demo/presentation/demos/food-blog.jpg';
import personalPortfolio from '../../../../img/demo/presentation/demos/personal-portfolio.jpg';
import coming from '../../../../img/demo/presentation/demos/coming.png';
import DemoTemplate from './DemoTemplate';

const Demo = () => (
  <section className="bg-secondary" id="demos">
    <div className="container pt-5 pb-4 py-md-6 py-lg-7">
      <div className="text-center mb-5 pt-3 pt-lg-4">
        <h2 className="h1 mb-4">Homepage <span className='bg-faded-primary rounded text-primary px-3 py-2'>Demos</span></h2>
        <p className="text-muted">Choose from pre-built layouts of our unique homepage demos</p>
      </div>
      <div className="row">
        <DemoTemplate link="/" img={businessConsulting} title="Business Consulting" keyWords="Corporate, Business, Agency" />
        <DemoTemplate link="/" img={shop} title="Shop Homepage" keyWords="E-Commerce, Retail, Electronics, Fashion" />
        <DemoTemplate link="/" img={booking} title="Booking / Directory" keyWords="Listings, Flights, Destinations" />
        <DemoTemplate link="/" img={creativeAgency} title="Creative Agency" keyWords="Creative Business, Portfolio, Agency" />
        <DemoTemplate link="/" img={webStudio} title="Web Studio" keyWords="Web Design, Portfolio, Agency" />
        <DemoTemplate link="/" img={softwareLanding} title="Product Landing - Software" keyWords="Software, Showcase, Landing Page" />
        <DemoTemplate link="/" img={gadgetLanding} title="Product Landing - Gadget" keyWords="Gadget, Showcase, Landing Page" />
        <DemoTemplate link="/" img={mobileApp} title="Mobile App Showcase" keyWords="Mobile App, Showcase, Landing" />
        <DemoTemplate link="/" img={coworking} title="Coworking Space" keyWords="Coworking Space Landing Page" />
        <DemoTemplate link="/" img={eventLanding} title="Event Landing" keyWords="Landing Page, Event, Countdown, Tickets" />
        <DemoTemplate link="/" img={templatePresentation} title="Web Template Presentation" keyWords="Showcase your Web Template features beautifully" />
        <DemoTemplate link="/" img={marketingSeo} title="Digital Marketing &amp; SEO" keyWords="Marketing services, Agency, Portfolio" />
        <DemoTemplate link="/" img={foodBlog} title="Food Blog" keyWords="Cooking, Recipes, Personal Blog" />
        <DemoTemplate link="/" img={personalPortfolio} title="Personal Portfolio" keyWords="Cooking, Recipes, Personal Blog" />
        <DemoTemplate link="/" img={coming} title="Coming Soon" keyWords="" />
      </div>
    </div>
  </section>
)

export default Demo;

