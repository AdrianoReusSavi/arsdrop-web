import './WaterDrop.css';

const WaterDrop = () => {
  return (
    <div className="ripple-container">
      <div className="drop" />
      <div className="ripple" />
      <div className="ripple delay" />
    </div>
  );
};

export default WaterDrop;