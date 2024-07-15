import React from "react";
import "../style.scss"; 

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-border text-primary spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;