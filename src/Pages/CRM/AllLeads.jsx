import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { saveAs } from "file-saver";
import TaskAssigner from "../../Modal/crm-modals/taskAssigner";
import { getAllLeads, getLeadById, updateLeadById, deleteLeadById, deleteMultipleLeads, exportLeads, getCrmUsers, getLeadsByFirmId, getCompanyForAdmin } from "../../apiServices/service";
import LeadDetailsModal from "../../Modal/crm-modals/leadDetailsModal";
import { useNavigate } from "react-router-dom";
import LeadImportModal from "../../Modal/crm-modals/leadImportModal";  
import { toast } from "react-toastify";
import { getRole } from "../../utils/roleUtils";
import FirmSwitcher from "../Firms/FirmSwitcher";
import { use } from "react";

function AllLeads() {
    const navigate = useNavigate();
    const [assignModal, setAssignModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const [importModal, setImportModal] = useState(false);
    const [filteredLeads, setFilteredLeads] = useState(false);
    const [modal, setModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOptions, setFilterOptions] = useState({
        sortBy: "name",
        order: "asc",
    });
    const role = JSON.parse(localStorage.getItem('authUser'))?.response?.role;
    const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.adminId || JSON.parse(localStorage.getItem('authUser'))?.response?.firmId;
    const [selectedFirmId, setSelectedFirmId] = useState(null);
    const idToUse = role === "client_admin" ? selectedFirmId : firmId;
    // console.log("firmId : ",firmId);
    // console.log("role:", role)
    useEffect(() => {
        getRole();
    }, []);

    useEffect(() => {
        const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
        if (defaultFirm && !selectedFirmId) {
            setSelectedFirmId(defaultFirm.firmId);
        }
    }, []);
    useEffect(() => {
        if (firmId || selectedFirmId) {
            fetchLeadsForFirm();
        }
    }, [firmId, selectedFirmId]);
    
    const fetchLeadsForFirm = async () => {
        try {
            const result = await getLeadsByFirmId(idToUse);
            setLeads(result?.data || []);
            setFilteredLeads(result?.data || []);
            // console.log("Leads for firm:", result?.data || []);
        } catch (error) {
            console.error("Error fetching leads:", error);
        }
    };

    useEffect(() => {
            fetchLeadsForFirm();
        }, []);
        
   const handleRefetchLeads = () => {
            fetchLeadsForFirm();
    };

    const fetchCrmUsers = async () => {
        try {
          const result = await getCrmUsers(idToUse);
          setUsers(result.data || []);
          // console.log(result.data);
        } catch (error) {
          alert(error.message || "Failed to get users");
        }
    };
    useEffect(() => {
        fetchCrmUsers();
        console.log("users : ", users);
    }, [idToUse]);
    
    const filterUsers = () => {
        if (role === "client_admin") {
            const filtered = users.filter((user) => user.roleId.roleName === "firm_admin" || user.roleId.roleName === "ASM" || user.roleId.roleName === "SM" || user.roleId.roleName === "Telecaller");
            setFilteredUsers(users);
            console.log("client admin users : ",filteredUsers);
        }

        if(role === "firm_admin"){
            const filtered = users.filter((user) => user.roleId.roleName === "ASM" || user.roleId.roleName === "SM" || user.roleId.roleName === "Telecaller");
            setFilteredUsers(filtered);
        }

        if (role === "ASM") {
          const filtered = users.filter((user) => user.roleId.roleName === "SM");
          setFilteredUsers(filtered);
        //   console.log("asm lower employees : ",filtered);
        //   console.log("asm lower employees : ",filteredUsers);
        } else if (role === "SM") {
          const filtered = users.filter((user) => user.roleId.roleName === "Telecaller");
          setFilteredUsers(filtered);
        } else {
          setFilteredUsers(users);
        }
      };

      useEffect(() => {
        fetchCrmUsers();
        }, []);

        useEffect(() => {   
            filterUsers();
        }, [users]);


    const toggleModal = async (id, mode = "view") => {
        if (!modal && id) {
            setLoading(true);
            try {
                const result = await getLeadById(id);
                setSelectedLead({ ...result?.data, mode });
            } catch (error) {
            } finally {
                setLoading(false);
            }
        } else {
            setSelectedLead(null);
        }
        setModal(!modal);
    };
    const toggleImportModal = () => {
        setImportModal((prev) => !prev);
        if (importModal) {
          fetchLeadsForFirm();
        }
      };
    
    const toggleAssignModal = () => setAssignModal(!assignModal);

    const handleLeadSelection = (leadId) => {
        setSelectedLeads((prevSelectedLeads) => {
            if (prevSelectedLeads.includes(leadId)) {
                return prevSelectedLeads.filter((id) => id !== leadId);
            } else {
                return [...prevSelectedLeads, leadId];
            }
        });
    };
    
    const handleSelectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            const updatedLeads = leads.map((lead) => lead._id);
            setSelectedLeads(updatedLeads);
        }
    };
    
    const handleDeleteLeads = async (leadId) => {
        if (leadId) {
            try {
                const result = await deleteLeadById([leadId]);
                toast.success(result.message);

                fetchLeadsForFirm();
            } catch (error) {
            }
        } else {
            if (selectedLeads.length === 0) {
                toast.error("Please select leads to delete.");
                return;
            }
            try {
                const result = await deleteMultipleLeads({ leadIds: selectedLeads });
                toast.success(result.message);
                fetchLeadsForFirm();
                setSelectedLeads([]);
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleUpdateLead = async (updatedLead) => {
        try {
            const result = await updateLeadById(updatedLead._id, updatedLead);
            toast.success(result.message);
            fetchLeadsForFirm();
            setModal(false);
        } catch (error) {
        }
    };
    // console.log(selectedLeads, "seletecdleads")
    const handleExportLeads = async () => {
        if (selectedLeads.length === 0) {
            toast.error("Please select leads to export.");
            return;
        }
        try {
            const result = await exportLeads({ leadIds: selectedLeads });
            const blob = new Blob([result], { type: "text/csv" });
            
            const now = new Date();
            const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
            const filename = `Lead-data_${formattedDate}_${formattedTime}.csv`;
            
            saveAs(blob, filename);
            toast.success("Leads exported successfully.");
        } catch (error) {
            toast.error(error);
        }
    };
    
    useEffect(() => {
        fetchLeadsForFirm();
    }, []);
    const handleFilterChange = (field, value) => {
        setFilterOptions((prev) => ({ ...prev, [field]: value }));
    };
    const applyFilters = () => {
        let filteredLeads = [...leads];
    
        // Apply Search Filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredLeads = filteredLeads.filter((lead) => {
                const name = `${lead.firstName} ${lead.lastName}`.toLowerCase();
                const email = lead.email?.toLowerCase();
                const status = lead.status?.toLowerCase();
    
                return (
                    name.includes(term) ||
                    email?.includes(term) ||
                    status?.includes(term)
                );
            });
        }
    
        // Sorting Logic (unchanged)
        if (filterOptions.sortBy === "name") {
            filteredLeads.sort((a, b) => {
                const nameA = a.firstName.toLowerCase();
                const nameB = b.firstName.toLowerCase();
                return filterOptions.order === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
        } else if (filterOptions.sortBy === "date") {
            filteredLeads.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return filterOptions.order === "asc" ? dateA - dateB : dateB - dateA;
            });
        } else if (filterOptions.sortBy === "status") {
            filteredLeads.sort((a, b) => {
                const statusA = a.status.toLowerCase();
                const statusB = b.status.toLowerCase();
                return filterOptions.order === "asc" ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
            });
        }
    
        setFilteredLeads(filteredLeads);
    };
    
    // const applyFilters = () => {
    //     let sortedLeads = [...leads];
    //     if (filterOptions.sortBy === "name") {
    //         sortedLeads.sort((a, b) => {
    //             const nameA = a.firstName.toLowerCase();
    //             const nameB = b.firstName.toLowerCase();
    //             return filterOptions.order === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    //         });
    //     } else if (filterOptions.sortBy === "date") {
    //         sortedLeads.sort((a, b) => {
    //             const dateA = new Date(a.createdAt);
    //             const dateB = new Date(b.createdAt);
    //             return filterOptions.order === "asc" ? dateA - dateB : dateB - dateA;
    //         });
    //     } else if (filterOptions.sortBy === "status") {
    //         sortedLeads.sort((a, b) => {
    //             const statusA = a.status.toLowerCase();
    //             const statusB = b.status.toLowerCase();
    //             return filterOptions.order === "asc" ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
    //         });
    //     }
    //     setFilteredLeads(sortedLeads);
    // };
    // useEffect(() => {
    //     applyFilters();
    // }, [filterOptions, leads]);
    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterOptions, leads]);
    
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const toggleFilterDropdown = () => setShowFilterDropdown(!showFilterDropdown);

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="CRM" breadcrumbItem="All Leads" />
                <div className="button-panel">
                    {(role === "client_admin" && (
                        <FirmSwitcher
                            selectedFirmId={selectedFirmId}
                            onSelectFirm={setSelectedFirmId}
                           />
                     ))}
                    {(role === "firm_admin" || role === "ASM" || role === "client_admin") && (
                        <>
                            <Button color="primary" style={{maxHeight:"27.13px",fontSize:"12.5px" , lineHeight:"1"}} onClick={() => navigate("/crm/create-lead")}> Add Lead </Button>
                            <Button color="primary" style={{maxHeight:"27.13px",fontSize:"12.5px" , lineHeight:"1"}} onClick={toggleImportModal}> Import Leads </Button>
                            <Button color="primary" style={{maxHeight:"27.13px",fontSize:"12.5px" , lineHeight:"1"}} onClick={handleExportLeads}> Export Leads </Button>
                        </>
                      )}
                    {(role === "firm_admin") && (
                        <Button color="primary" style={{maxHeight:"27.13px",fontSize:"12.5px" , lineHeight:"1"}} onClick={() => handleDeleteLeads(null)}> Delete Selected Leads </Button>
                       )}
                    {/* {(role === "ASM" || role === "SM" || role === "firm_admin" || role === "client_admin"  ) && ( */}
                    {(role === "ASM" || role === "SM" || role === "firm_admin" ) && (
                        <Button color="primary" style={{maxHeight:"27.13px",fontSize:"12.5px" , lineHeight:"1"}} onClick={toggleAssignModal}> Assign Leads </Button>
                      )}

                {/* { role ==="ASM" && (
                    <Button color="primary" onClick={toggleAssignModal}> Assign Leads </Button> 
                )} */}
                </div>
                <div className="search-bar mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name, Email, or Status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "300px", display: "inline-block", marginRight: "10px" }}
                    />
                </div>

                <div className="filter-panel" style={{ float: "right", marginTop: "-50px", position: "relative" }}>
                <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",marginRight: "10px",color: "black",transition: "color 0.3s ease"}} onClick={handleRefetchLeads} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
                    <i
                        className="mdi mdi-filter"
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            padding: "5px 7px",
                            border: "1px solid #ccc",
                        }}
                        onClick={toggleFilterDropdown}
                    ></i>
                    {showFilterDropdown && (
                        <div
                            className="dropdown-menu show"
                            style={{
                                position: "absolute",
                                right: "0",
                                top: "40px",
                                zIndex: 1050,
                                display: "block",
                            }}
                        >
                            <div className="p-3">
                                <label>Sort By:</label>
                                <select
                                    value={filterOptions.sortBy}
                                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                    className="form-control"
                                >
                                    <option value="name">Name</option>
                                    <option value="date">Date</option>
                                    <option value="status">Status</option>
                                </select>
                                <label className="mt-2">Order:</label>
                                <select
                                    value={filterOptions.order}
                                    onChange={(e) => handleFilterChange("order", e.target.value)}
                                    className="form-control"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                {/* <input
                                    type="checkbox"
                                    onClick={() => {
                                        const unassignedLeads = leads.filter((lead) => lead.status !== "Assigned");
                                        if (selectedLeads.length === unassignedLeads.length) {
                                        console.log("Deselecting all unassigned leads");
                                        setSelectedLeads([]);
                                    } else {
                                        console.log("Selecting all unassigned leads");
                                        setSelectedLeads(unassignedLeads.map((lead) => lead._id));
                                        console.log(selectedLeads);
                                        }
                                    }}
                                    /> */}
                                    <input
                                        type="checkbox"
                                        onClick={() => {
                                            if (selectedLeads.length === leads.length) {
                                                console.log("Deselecting all leads");
                                                setSelectedLeads([]);
                                            } else {
                                                console.log("Selecting all leads");
                                                setSelectedLeads(leads.map((lead) => lead._id));
                                            }
                                        }}
                                    />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Platform</th>
                                <th>Organic</th>
                                <th>Ad. Data</th>
                                <th>Created/Updated</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                       <tbody>
                            {Array.isArray(filteredLeads) && filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id}  onClick={() => toggleModal(lead._id, "view")} style={{ cursor: "pointer" }}>
                                        <td
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                
                                            }}
                                        >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeads.includes(lead._id)}
                                                    onClick={(e) => {
                                                        handleLeadSelection(lead._id);
                                                        e.stopPropagation();
                                                    }}
                                                />
                                        </td>
                                        <td>{lead.firstName + " " + lead.lastName}</td>
                                        <td>{lead.email}</td>
                                        <td>{lead.phoneNumber}</td>
                                        <td>{lead.platform}</td>
                                        <td>{lead.isOrganic ? "yes" : "no"}</td>
                                        <td>{lead.adId}<br />{lead.adName}</td>
                                        <td>
                                            {new Date(lead.createdAt).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                            <br />
                                            {new Date(lead.updatedAt).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </td>
                                        <td>
                                            {lead.status
                                                ?.replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, (str) => str.toUpperCase())
                                            }
                                        </td>

                                        <td>
                                          
                                            <i
                                                className="bx bx-edit"
                                                style={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleModal(lead._id, "edit")}}
                                            ></i>
                                            <i
                                                className="bx bx-trash"
                                                style={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteLeads(lead._id)}
                                            }
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center">
                                        No leads found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                {/* {message && <p className="text-danger">{message}</p>} */}

                <LeadDetailsModal
                    isOpen={modal}
                    toggle={() => toggleModal(null)}
                    lead={selectedLead}
                    loading={loading}
                    onUpdate={handleUpdateLead}
                />
                <TaskAssigner
                    firmId={idToUse}
                    isOpen={assignModal}
                    toggle={toggleAssignModal}
                    selectedLeads={selectedLeads}
                    fetchLeads={fetchLeadsForFirm}
                    filteredUsers={filteredUsers}
                />
                <LeadImportModal isOpen={importModal} toggle={toggleImportModal} firmId={role === "client_admin" ? selectedFirmId : firmId} />
            </div>
        </React.Fragment>
    );
}

export default AllLeads;