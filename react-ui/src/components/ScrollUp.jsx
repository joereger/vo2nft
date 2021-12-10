import { useEffect, useRef } from "react";

const ScrollUp = () => {
  const scrollRef = useRef();
  const scrollTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    const element = scrollRef;
    const scrollOffset = 600;
    const offsetFromTop = parseInt(scrollOffset, 10);
    window.addEventListener('scroll', function (e) {
      if (e.currentTarget.pageYOffset > offsetFromTop) {
        element.current.classList.add('show');
      } else {
        element.current.classList.remove('show');
      }
    });
  });
  return (
    <span className="btn-scroll-top" data-scroll data-fixed-element onClick={scrollTop} ref={scrollRef} style={{cursor: 'pointer'}}>
      <span className="btn-scroll-top-tooltip text-muted fs-sm me-2">Top</span>
      <i className="btn-scroll-top-icon ai-arrow-up"></i>
    </span>
)};

export default ScrollUp;
