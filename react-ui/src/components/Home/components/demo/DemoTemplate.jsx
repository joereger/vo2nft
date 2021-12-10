const DemoTemplate = ({ link, img, title, keyWords }) => (
  <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-3">
    <a className="d-block nav-heading text-center" href={link}>
      <div className="card card-hover border-0 shadow-lg mb-4">
        <img className="card-img" src={img} alt={title} />
      </div>
      <h3 className="h5 nav-heading-title mb-0">{title}</h3>
      <span className="fs-sm fw-normal text-muted">{keyWords}</span>
    </a>
  </div>
)

export default DemoTemplate;
