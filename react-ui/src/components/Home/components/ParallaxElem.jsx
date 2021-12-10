import ParallaxMousemove from 'react-parallax-mousemove';

const ParallaxElement = ({ image, index, x, y }) => (
    <ParallaxMousemove.Layer
      layerStyle={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: index
      }}
      config={{
        xFactor: x,
        yFactor: y,
      }}
    >
      <img src={image} alt="Layer" />
    </ParallaxMousemove.Layer>
);

export default ParallaxElement;
