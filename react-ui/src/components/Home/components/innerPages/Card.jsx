import { Nav } from 'react-bootstrap';

const Card = ({ tab, image, imageAlt, title }) => (
  <Nav.Item className="mb-3" style={{width: '16.5rem', cursor: 'pointer'}}>
    <Nav.Link className="nav-link me-2" eventKey={tab} data-bs-toggle="tab" role="tab">
      <div className="d-flex align-items-center">
        <img className="rounded" src={image} alt={imageAlt} width="60" />
        <div className="w-100 ps-2 ms-1">
          <div className="d-flex justify-content-between align-items-center">
            <div className="fs-sm pe-1" style={{lineHeight: '20px'}}>{title}</div>
            <i className="ai-chevron-right lead ms-2 me-1"></i>
          </div>
        </div>
      </div>
    </Nav.Link>
  </Nav.Item>
);

export default Card;

