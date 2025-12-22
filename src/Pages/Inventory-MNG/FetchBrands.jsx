import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const FetchBrands = ({ firmId, onBrandsFetched, triggerBrand }) => {
  useEffect(() => {
    const fetchBrands = async () => {
      if (!firmId) return;
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_URL}/brand/get-brands/${firmId}`
        );
        onBrandsFetched(response.data || []);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchBrands();
  }, [triggerBrand , firmId]); 

  return null; 
};

export default FetchBrands;
