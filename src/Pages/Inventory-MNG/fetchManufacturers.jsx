import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
const FetchManufacturers = ({ firmId, onManufacturersFetched, triggerManufacturer }) => {
 useEffect(() => {
    const fetchManufacturers = async () => {
      if (!firmId) return;
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_URL}/manufacturer/get-manufacturers/${firmId}`
        );

        if (response.data?.length === 0 || response.data === null) {
          onManufacturersFetched([]);
          toast.info("No manufacturers found");
        } else {
          onManufacturersFetched(response.data);
          // toast.success("Manufacturers fetched successfully");
        }
      } catch (error) {
        onManufacturersFetched([]);
        if (error.response?.data?.error === "No manufacturers found for this Firm") {
          toast.info("No manufacturers found");
        } else {
          // toast.error("Failed to fetch manufacturers");
        }
        console.error(error.message);
      }
    };

    fetchManufacturers();
  }, [firmId, triggerManufacturer]);

  return null; 
};

export default FetchManufacturers;
