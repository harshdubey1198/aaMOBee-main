import React, { useEffect, useState } from "react";
import axios from "axios";
import { updateUserById } from "../../apiServices/service";
import { Input } from "reactstrap";
import { toast } from "react-toastify";

function UserTable({ selectedFirmId, trigger, searchQuery }) {
  const [userData, setUserData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
  const token = authuser?.token;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const toPascalCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const firmId = selectedFirmId || defaultFirm?._id;
  const companyTitle = defaultFirm?.companyTitle;

  const fetchUsers = async () => {
    try {
      let response;
      if (authuser?.response?.role === "super_admin") {
        response = await axios.get(`${process.env.REACT_APP_URL}/auth/getCompany/${authuser.response._id}`);
      } else if (authuser?.response?.role === "client_admin") {
        response = await axios.get(`${process.env.REACT_APP_URL}/auth/getCompany/${firmId}`);
      } else if (authuser?.response?.role === "firm_admin") {
        response = await axios.get(`${process.env.REACT_APP_URL}/auth/getCompany/${authuser.response.adminId}`);
      }

      if (response && Array.isArray(response)) {
        setUserData(response);
        setFilteredUsers(response);
        if (response.length > 0) {
        // toast.success("Users fetched successfully!");
      }
      }
      

    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // 🔍 Apply search filter when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(userData);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = userData.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.mobile.includes(searchQuery) ||
        user.role.toLowerCase().includes(lowercasedQuery)
      );
    });

    setFilteredUsers(filtered);
  }, [searchQuery, userData]);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/auth/userInactive/${userId}`,
        { status: !currentStatus },
        config
      );
      // console.log(response.message); 
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status", error);
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    try {
      const updateData = { role: newRole };
      const result = await updateUserById(userId, updateData);
      
      toast.success(`Role updated successfully for ${result.firstName}`);
      fetchUsers(); 
    } catch (error) {
      console.error("Error updating role", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [selectedFirmId, trigger]);

  return (
    <div>
      {companyTitle ? <h5 className="text-center card-title-heading m-0"><span>{companyTitle}</span></h5> : null}

      <div className="table-responsive">
        <table className="table table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th style={{width:"160px"}}>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="align-items-center">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{toPascalCase(`${user.firstName} ${user.lastName}`)}</td>
                  <td>{user?.mobile}</td>
                  <td>{user?.email}</td>
                  <td>
                {(authuser.response.role === "firm_admin" && user._id === authuser.response._id) ? (
                  <span>{user.role.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</span>
                ) : (
                  <Input
                    type="select"
                    style={{ width: "150px" }}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="firm_admin">Firm Admin</option>
                    <option value="accountant">Accountant</option>
                    <option value="employee">Employee</option>
                  </Input>
                )}
                  </td>
                  <td>{user?.isActive ? "Active" : "Inctive"}</td>
                  <td>
                    {user._id !== authuser.response._id && (
                      <button
                        style={{width:"80.96px"}}
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        className={`btn btn-sm ${user.isActive ? "btn-danger" : "btn-success"}`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {searchQuery ? "No results match your search." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}

export default UserTable;
 