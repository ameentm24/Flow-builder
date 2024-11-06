import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>Page Not Found</div>
      <div>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
};

export default PageNotFound;
