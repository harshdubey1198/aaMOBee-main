import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardBody, Row, Col, Button, Table, Input, Label, Spinner } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getAllHrmsPermissions, getUsersByHrmsPermission, getFirmUsersWithPermissions, addHrmsPermission, removeHrmsPermission } from "../../../apiServices/service";
import { toast } from "react-toastify";
import PermissionSetupModal from "../../../Modal/Firms/PermissionSetupModal";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import AssignPermissionToUserModal from "../../../Modal/Firms/AssignPermissionToUserModal";

export default function PermissionMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const role = authUser?.role;
  const defaultFirm = authUser?.firmId || authUser?.adminId || authUser?.clientFirmId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const firmId = role === "client_admin" ? selectedFirmId : defaultFirm;

  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [firmUsersMode, setFirmUsersMode] = useState(true);

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [operationType, setOperationType] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const togglePermissionModal = () => setPermissionModalOpen((p) => !p);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const toggleAssignModal = () => setAssignModalOpen((p) => !p);

  // Refs for infinite scroll
  const observerTarget = useRef(null);
  const scrollContainerRef = useRef(null);

  const loadPermissions = async () => {
    try {
      const res = await getAllHrmsPermissions();
      console.log("Permissions:", res);
      setPermissions(res?.data || []);
    } catch {
      toast.error("Failed to load permissions");
    }
  };

  const loadUsers = async (page = 1, append = false) => {
    if (firmUsersMode && !firmId) {
      setUsers([]);
      return;
    }

    if (!selectedPermission && !firmUsersMode) {
      setUsers([]);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let res;
      
      if (firmUsersMode) {
        const payload = {
          firmId,
          page,
          limit: 10, // Adjust as needed
        };
        
        if (selectedPermission) {
          payload.permission = selectedPermission;
        }
        
        res = await getFirmUsersWithPermissions(payload);
      } else {
        res = await getUsersByHrmsPermission(selectedPermission, page);
      }

      const responseData = res?.data?.data || res?.data || [];
      const paginationData = res?.data;

      if (append) {
        setUsers((prev) => [...prev, ...responseData]);
      } else {
        setUsers(responseData);
      }

      // Update pagination state
      setCurrentPage(paginationData?.currentPage || page);
      setTotalPages(paginationData?.totalPages || 1);
      setHasMore(!!paginationData?.nextPage);

    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more users when scrolling down
  const loadMoreUsers = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      loadUsers(nextPage, true);
    }
  }, [currentPage, totalPages, hasMore, loadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreUsers();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMoreUsers]);

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
      // Reload from page 1 to reflect changes
      setCurrentPage(1);
      loadUsers(1, false);
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleAssignFromModal = async ({ userId, permissions }) => {
    try {
      await Promise.all(
        permissions.map((p) =>
          addHrmsPermission({ userId, permission: p })
        )
      );

      toast.success("Permissions assigned successfully");
      toggleAssignModal();
      // Reload from page 1
      setCurrentPage(1);
      loadUsers(1, false);
    } catch {
      toast.error("Failed to assign permissions");
    }
  };

  const handleRefetch = () => {
    setCurrentPage(1);
    loadUsers(1, false);
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  useEffect(() => {
    setUsers([]);
    setCurrentPage(1);
    loadUsers(1, false);
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

          <Button color="primary" className="justified-button" onClick={toggleAssignModal}>
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
            <>
              <div 
                ref={scrollContainerRef}
                style={{ 
                  maxHeight: '600px', 
                  overflowY: 'auto',
                  position: 'relative'
                }}
              >
                <Table bordered responsive>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
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

                {/* Intersection Observer Target */}
                {hasMore && (
                  <div 
                    ref={observerTarget}
                    style={{ 
                      height: '20px', 
                      margin: '10px 0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {loadingMore && <Spinner size="sm" />}
                  </div>
                )}
              </div>

              {/* Pagination Info */}
              {users.length > 0 && (
                <div className="text-center mt-3 text-muted">
                  <small>
                    Page {currentPage} of {totalPages} 
                    {loadingMore && " • Loading more..."}
                  </small>
                </div>
              )}
            </>
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