import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, Col, Button, Table, Input, Label, Spinner, } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getAllHrmsPermissions, getUsersByHrmsPermission, getFirmUsersWithPermissions, addHrmsPermission, removeHrmsPermission, } from "../../../apiServices/service";
import { toast } from "react-toastify";
import PermissionSetupModal from "../../../Modal/Firms/PermissionSetupModal";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import AssignPermissionToUserModal from "../../../Modal/Firms/AssignPermissionToUserModal";

export default function PermissionMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;

  const role = authUser?.role;
  const defaultFirm =
    authUser?.firmId || authUser?.adminId || authUser?.clientFirmId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const firmId = role === "client_admin" ? selectedFirmId : defaultFirm;

  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [firmUsersMode, setFirmUsersMode] = useState(true);

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [operationType, setOperationType] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const togglePermissionModal = () => setPermissionModalOpen((p) => !p);

  // 👉 NEW MODAL (Assign to any user)
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const toggleAssignModal = () => setAssignModalOpen((p) => !p);

  const loadPermissions = async () => {
    try {
      const res = await getAllHrmsPermissions();
      setPermissions(res?.data || []);
    } catch {
      toast.error("Failed to load permissions");
    }
  };

  const loadUsers = async () => {
    if (firmUsersMode && !firmId) {
      setUsers([]);
      return;
    }

    if (!selectedPermission && firmUsersMode) {
      setLoading(true);
      try {
        const res = await getFirmUsersWithPermissions({ firmId });
        setUsers(res?.data || []);
      } catch {
        toast.error("Failed to load firm users");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!selectedPermission && !firmUsersMode) {
      setUsers([]);
      return;
    }

    setLoading(true);

    try {
      if (firmUsersMode) {
        const res = await getFirmUsersWithPermissions({
          firmId,
          permission: selectedPermission,
        });
        setUsers(res?.data || []);
      } else {
        const res = await getUsersByHrmsPermission(selectedPermission);
        setUsers(res?.data || []);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = (user) => {
    setSelectedUser(user);
    setOperationType("add");
    togglePermissionModal();
  };

  const handleOpenRemove = (user) => {
    setSelectedUser(user);
    setOperationType("remove");
    togglePermissionModal();
  };

  const handlePermissionUpdate = async (list) => {
    if (!selectedUser?._id) return;

    try {
      if (operationType === "add") {
        await Promise.all(
          list.map((p) =>
            addHrmsPermission({ userId: selectedUser._id, permission: p })
          )
        );
        toast.success("Permissions assigned");
      } else {
        await Promise.all(
          list.map((p) =>
            removeHrmsPermission({ userId: selectedUser._id, permission: p })
          )
        );
        toast.success("Permissions removed");
      }

      togglePermissionModal();
      loadUsers();
    } catch {
      toast.error("Operation failed");
    }
  };

  // 👉 HANDLE EXTERNAL ASSIGN MODAL SAVE
  const handleAssignFromModal = async ({ userId, permissions }) => {
    try {
      await Promise.all(
        permissions.map((p) =>
          addHrmsPermission({ userId, permission: p })
        )
      );

      toast.success("Permissions assigned successfully");
      toggleAssignModal();
      loadUsers();
    } catch {
      toast.error("Failed to assign permissions");
    }
  };

  const handleRefetch = () => {
    loadUsers();
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  useEffect(() => {
    setUsers([]);
    loadUsers();
  }, [selectedPermission, firmUsersMode, firmId]);

  return (
    <div className="page-content">
      <Breadcrumbs title="HRMS" breadcrumbItem="Permissions" />

      <Row className="mb-3">
        <Col md="8" className="d-flex gap-2 align-items-center">
          <i
            className="bx bx-refresh cursor-pointer"
            style={{
              fontSize: "24.5px",
              fontWeight: "bold",
              marginRight: "10px",
              color: "black",
              transition: "color 0.3s ease",
            }}
            onClick={handleRefetch}
            onMouseEnter={(e) => (e.target.style.color = "green")}
            onMouseLeave={(e) => (e.target.style.color = "black")}
          ></i>

          <Button color="primary" onClick={toggleAssignModal}>
            + Assign Permission To User
          </Button>

          {role === "client_admin" && (
            <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={setSelectedFirmId}
            />
          )}
        </Col>
      </Row>

      <Card>
        <CardBody>
          <Row className="mb-3">
            <Col md="4">
              <Label>Select Permission</Label>
              <Input
                type="select"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
              >
                <option value="">— All Permissions —</option>
                {permissions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner />
            </div>
          ) : (
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>
                        {u.firstName} {u.lastName}
                      </td>
                      <td>{u.email}</td>

                      <td>
                        {u.permissionsHolding?.map((p) => {
                          const formatted = p
                            ?.split(".")
                            .map(
                              (str) =>
                                str.charAt(0).toUpperCase() + str.slice(1)
                            )
                            .join(" ");

                          return <div key={p}>{formatted}</div>;
                        })}
                      </td>

                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          color="success"
                          onClick={() => handleOpenAssign(u)}
                        >
                          Assign
                        </Button>

                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => handleOpenRemove(u)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <PermissionSetupModal
        isOpen={permissionModalOpen}
        toggle={togglePermissionModal}
        permissions={permissions}
        user={selectedUser}
        operationType={operationType}
        onSubmit={handlePermissionUpdate}
      />

      <AssignPermissionToUserModal
        isOpen={assignModalOpen}
        toggle={toggleAssignModal}
        firmId={firmId}
        permissions={permissions}
        onSubmit={handleAssignFromModal}
      />
    </div>
  );
}
