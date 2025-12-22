import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="btn btn-light d-flex align-items-center px-3 py-2 shadow-sm rounded"
      style={{ fontWeight: 500 }}
    >
      <i className="bx bx-arrow-back me-2 fs-5"></i>
      Back
    </button>
  );
};
