import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFirmsRequest, setCurrentFirm } from "../../store/firms/actions";
import { Link } from "react-router-dom";

const FirmSwitcher = ({ selectedFirmId,onSelectFirm }) => {
  const dispatch = useDispatch();
  const { firms = [], loading, error, currentFirmId } = useSelector(state => state.firmsState || {});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFirmsRequest());
  }, [dispatch]);
  
useEffect(() => {
  if (firms.length === 0) return;

  // from localStorage
  const localFirmId = JSON.parse(localStorage.getItem("defaultFirm"))?.firmId;
  // console.log("firms in the switcher api : " , firms)
  // check if valid
  const firmFromStorage = firms.find(f => f._id === localFirmId);
  
  // decide firm to use
  const firmIdToUse = selectedFirmId || (firmFromStorage?._id) || firms[0]._id;
  const selectedFirm = firms.find(f => f._id === firmIdToUse) || firms[0];

  if (selectedFirm && selectedFirm._id) {
    dispatch(setCurrentFirm(selectedFirm._id));

    // always refresh localStorage with the correct firm
    localStorage.setItem(
      "defaultFirm",
      JSON.stringify({
        firmId: selectedFirm._id,
        fuid: selectedFirm.fuid,
        name: selectedFirm.firmName,
        companyTitle: selectedFirm.companyTitle,
      })
    );

    if (onSelectFirm) {
      onSelectFirm(selectedFirm._id);
    }
  }
}, [firms, selectedFirmId, currentFirmId, dispatch, onSelectFirm]);

  // Handle firm selection change
  const handleChange = (e) => {
    const newFirmId = e.target.value;
    const selectedFirm = firms.find(f => f._id === newFirmId);

    dispatch(setCurrentFirm(newFirmId));
    localStorage.setItem(
      "defaultFirm",
      JSON.stringify({
        firmId: selectedFirm._id,
        fuid: selectedFirm.fuid,
        name: selectedFirm.firmName,
        companyTitle: selectedFirm.companyTitle,
      })
    );

    if (onSelectFirm) {
      onSelectFirm(newFirmId);
    }

    setIsDropdownOpen(false);
  };

  const handleMouseDown = () => setIsDropdownOpen(true);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p>Loading firms...</p>;
  if (error) return <p>Error loading firms</p>;
  if (firms.length === 0) {
    return (
      <Link
        to="/add-business"
        className="btn btn-primary p-2"
        title="Add your business to continue"
        style={{ maxHeight: "27.13px",minWidth:"100px", fontSize: "10.5px", lineHeight: "1" }}
      >
        Add Business
      </Link>
    );
  }
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        ref={selectRef}
        className="form-select"
        onMouseDown={handleMouseDown}
        onChange={handleChange}
        value={currentFirmId || firms[0]?._id || ""}       
        style={{
          minWidth: "120px",
          maxWidth: "200px",
          padding: "5px 30px 5px 5px",
          fontSize: "12px",
          backgroundColor: "var(--bs-header-dark-bg)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {firms.map(firm => (
          <option
            key={firm._id}
            value={firm._id}
            style={{ backgroundColor: "var(--bs-header-dark-bg)", color: "white" }}
          >
            {firm.companyTitle}
          </option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          right: "6.5px",
          top: "49%",
          transform: `translateY(-50%) rotate(${isDropdownOpen ? 180 : 0}deg)`,
          transition: "transform 0.2s ease-in-out",
          pointerEvents: "none",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
    </div>
  );
};

export default FirmSwitcher;
