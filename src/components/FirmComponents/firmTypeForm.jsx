import React, { useState, useEffect } from "react";

function FirmTypeForm({ firmDetails, setFirmDetails }) {
  const [fields, setFields] = useState([]);
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const role = authuser?.response?.role;
  // console.log(role);
  // console.log(firmDetails);

  const firmTypes = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership Firm" },
    { value: "llc" , label: "Limited Liability Company (LLC)" },
    { value: "llp", label: "Limited Liability Partnership (LLP)" },
    { value: "pvt_ltd", label: "Private Limited Company (Pvt. Ltd.)" },
    { value: "public_ltd", label: "Public Limited Company (Ltd.)" },
    { value: "opc", label: "One Person Company (OPC)" },
  ];

  const fieldsMap = {
    sole_proprietorship: ["pan", "udyam", "shopAndEstablishmentLicense", "currentBankAccount"],
    partnership: ["pan", "partnershipDeed", "tan", "udyam", "shopAndEstablishmentLicense"],
    llp: ["pan", "certificateOfIncorporation", "llpAgreement", "tan", "digitalSignatureCertificate", "din", "udyam"],
    llc: ["pan", "certificateOfIncorporation", "llpAgreement", "tan", "digitalSignatureCertificate", "din", "udyam"],
    pvt_ltd: ["pan", "certificateOfIncorporation", "moaAndAoa", "tan", "dsc", "din", "esiAndPfRegistration", "udyam"],
    public_ltd: ["pan", "certificateOfIncorporation", "moaAndAoa", "tan", "dsc", "din", "esiAndPfRegistration", "cin", "sebiRegistration"],
    opc: ["pan", "certificateOfIncorporation", "moaAndAoa", "tan", "dsc", "din", "udyam"],
  };

  useEffect(() => {
    setFields(fieldsMap[firmDetails.firmDetails?.firmType] || []);
  }, [firmDetails.firmDetails?.firmType]);

  const handleFirmTypeChange = (e) => {
    const selectedFirmType = e.target.value;
    setFirmDetails((prev) => ({
      ...prev,
      firmDetails: { ...prev.firmDetails, firmType: selectedFirmType },
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFirmDetails((prev) => ({
      ...prev,
      firmDetails: { ...prev.firmDetails, [name]: value },
    }));
  };

  return (
    <div>
      <div className="form-group">
        <h3 className="section-title">Firm Type Details</h3>
            {/* {(role === "client_admin" || role === "super_admin") && ( */}
                <>
                  <label>Business Type</label>
                  <select
                    className="form-control mb-3"
                    value={firmDetails?.firmDetails?.firmType || ""}
                    onChange={handleFirmTypeChange}
                  >
                    <option value="">Select Business Type</option>
                    {firmTypes.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </>
              {/*  )} */}

      </div>

      {fields.map((field) => (
        <div className="form-group" key={field}>
          <label>
              {field
                .replace(/([a-z])([A-Z])/g, "$1 $2") 
                .replace(/[_-]/g, " ") 
                .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())} 
            </label>

          <input
            type="text"
            className="form-control mb-2"
            name={field}
            value={firmDetails?.firmDetails?.[field] || ""}
            onChange={handleFieldChange}
          />
        </div>
      ))}
    </div>
  );
}

export default FirmTypeForm;
