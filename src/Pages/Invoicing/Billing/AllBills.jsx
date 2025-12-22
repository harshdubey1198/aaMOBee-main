import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import FirmSwitcher from '../../Firms/FirmSwitcher';
import { getCompanyData, getFirmBills } from '../../../apiServices/service';
import BillPreviewModal from '../../../Modal/BillPreviewModal';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from 'reactstrap';
import { BackButton } from '../../../components/Common/BackButton';

function AllBills() {
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [companyData, setCompanyData] = useState({});
  const [billsData, setBillsData] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [previewBill, setPreviewBill] = useState(null);
  const [idToUse, setIdToUse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage] = useState(10);

  const authuser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const firmId = authuser?.adminId;
  const role = authuser?.role;

  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "client_admin") {
      setIdToUse(firmId);
    }
  }, [firmId, role]);

  useEffect(() => {
    if (idToUse) {
      fetchAllBills(idToUse);
      fetchCompanyData(idToUse);
    }
  }, [idToUse]);

  const [selectedBillLayout, setSelectedBillLayout] = useState('null');

  // useEffect(() => {
  //   // Retrieve the selected layout from localStorage (default to 'layout1')
  //   const savedLayout = localStorage.getItem('selectedBillLayout') || 'layout1';
  //   setSelectedBillLayout(savedLayout); // Set the selected layout
  // }, []);


  const fetchAllBills = async (firmIdToUse) => {
    try {
      const response = await getFirmBills(firmIdToUse);
      setBillsData(response.data || []);
      setFilteredBills(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanyData = async (firmIdToUse) => {
    try {
      const response = await getCompanyData(firmIdToUse);
      setCompanyData(response[0] || {});
    } catch (error) {
      console.log(error);
    }
  };

  const handleFirmSelect = (firmId) => {
    setSelectedFirmId(firmId);
    setIdToUse(firmId);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = billsData.filter((bill) =>
      bill.customerName.toLowerCase().includes(term) ||
      bill.customerEmail.toLowerCase().includes(term) ||
      bill.billNumber.toString().includes(term)
    );
    setFilteredBills(filtered);
    setCurrentPage(1);
  };

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Invoicing" breadcrumbItem="Retail Bills" />

        <div className="button-panel d-flex gap-2 mb-2 align-items-center">
                 <BackButton/>
          {role === "client_admin" && (
            <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={handleFirmSelect}
            />
          )}
          <Button color="primary" className="p-2" style={{ maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }} onClick={() => { navigate('/create-bill'); }}>
            Create Bill
          </Button>
          <Input
            type="text"
            placeholder="Search by name, email, or bill number"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '250px', fontSize: '12px' }}
          />
        </div>

        <div className='table-responsive'>
          <table className='table table-bordered table-striped'>
            <thead>
              <tr>
                <th scope="col">Bill No</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Bill</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBills.length > 0 ? (
                currentBills.map((bill) => (
                  <tr
                    key={bill._id}
                    onClick={() => {
                      setPreviewBill(bill);
                      setSelectedBillLayout(bill.billLayout || 'layout1'); // Use billLayout from backend
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{bill.billNumber}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.customerEmail}</td>
                    <td>{bill.customerPhone}</td>
                    <td>{bill.totalAmount} {bill.billCurrency}</td>
                    <td>{bill.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No matching bills found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages >= 1 && (
          <div className="d-flex justify-content-center mt-3 gap-2">
            {[...Array(totalPages).keys()].map((num) => (
              <Button
                key={num + 1}
                onClick={() => paginate(num + 1)}
                color={currentPage === num + 1 ? "primary" : "secondary"}
                size="sm"
              >
                {num + 1}
              </Button>
            ))}
          </div>
        )}

        {previewBill && (
          <BillPreviewModal
            bill={previewBill}
            companyData={companyData}
            onClose={() => {
              setPreviewBill(null);
              setSelectedBillLayout(null); // Reset layout
            }}
            layoutType="bill"
            layoutId={selectedBillLayout} // This is dynamic now!
          />
        )}

      </div>
    </React.Fragment>
  );
}

export default AllBills;
