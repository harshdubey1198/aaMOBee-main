import React, { useEffect, useState } from "react";
import axios from "axios";
import { updateUserById } from "../../apiServices/service";
import { Input } from "reactstrap";
import { toast } from "react-toastify";
import ConfirmationModal from "../../Modal/ConfirmationModal";
import ResetPasswordModal from "../../Modal/ResetPasswordModal";

function UserTable({ selectedFirmId, trigger, searchQuery }) {
  const [userData, setUserData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
  const token = authuser?.token;
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetModal, setResetModal] = useState(false);

  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setResetModal(true);
  };

  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setConfirmModal(true);
  };

  // confirm action
  const handleConfirm = async (user) => {
    await toggleUserStatus(user._id, user.isActive);
    setConfirmModal(false);
  };

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
        response = await axios.get(
          `${process.env.REACT_APP_URL}/auth/getCompany/${authuser.response._id}`
        );
      } else if (authuser?.response?.role === "client_admin") {
        response = await axios.get(
          `${process.env.REACT_APP_URL}/auth/getCompany/${firmId}`
        );
      } else if (authuser?.response?.role === "firm_admin") {
        response = await axios.get(
          `${process.env.REACT_APP_URL}/auth/getCompany/${authuser.response.adminId}`
        );
      }

      if (response && Array.isArray(response)) {
        setUserData(response);
        setFilteredUsers(response);
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
        { isActive: !currentStatus },
        config
      );

      if (response?.data && !response.data.error) {
        toast.success("User status updated successfully!");
      }
      fetchUsers();
    } catch (error) {
      console.error(
        "Error toggling user status",
        error.response?.data || error.message
      );
      toast.error("Failed to update user status.");
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
      {companyTitle ? (
        <h5 className="text-center card-title-heading m-0">
          <span>{companyTitle}</span>
        </h5>
      ) : null}

      <div className="table-responsive">
        <table className="table table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th style={{ width: "160px" }}>Role</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Passwords</th>
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
                    {authuser.response.role === "firm_admin" &&
                      user._id === authuser.response._id ? (
                      <span>
                        {user.role
                          .replace(/[_-]/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                    ) : (
                      <Input
                        type="select"
                        style={{ width: "150px" }}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                      >
                        <option value="firm_admin">Firm Admin</option>
                        <option value="accountant">Accountant</option>
                        <option value="employee">Employee</option>
                      </Input>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${user?.isActive ? "bg-success" : "bg-danger"
                        }`}
                    >
                      {user?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    {user._id !== authuser.response._id && (
                      <button
                        onClick={() => handleToggleClick(user)}
                        className={`btn btn-sm ${user.isActive
                            ? "btn-outline-danger"
                            : "btn-outline-success"
                          }`}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "8px 16px",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
                        }}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleResetPasswordClick(user)}
                      className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                        padding: "6px 12px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
                      }}
                    >
                      <i
                        className="ri-key-2-fill"
                        style={{ fontSize: "18px" }}
                      ></i>
                      Reset
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {searchQuery
                    ? "No results match your search."
                    : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Confirmation Modal for Activate/Deactivate */}
        <ConfirmationModal
          isOpen={confirmModal}
          toggle={() => setConfirmModal(false)}
          selectedUser={selectedUser}
          toPascalCase={toPascalCase}
          action="activate"
          onConfirm={handleConfirm}
        />

        {/* Reset Password Modal */}
        <ResetPasswordModal
          isOpen={resetModal}
          toggle={() => setResetModal(false)}
          user={selectedUser}
          config={config}
          fetchUsers={fetchUsers}
          type="auth"   // 👉 points to /auth/changePassword/:id
        />
      </div>
    </div>
  );
}

export default UserTable;
