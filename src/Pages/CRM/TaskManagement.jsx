import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getAllTasks, getCrmUsers, updateTask, updateAssignees, getTasksByFirmId } from "../../apiServices/service";
import { getRole } from "../../utils/roleUtils";
import { Table, Button } from "reactstrap";
import TaskEditModal from "../../Modal/crm-modals/taskReassignModal";
import TaskDetailedTableModal from "../../Modal/crm-modals/taskDetailedTableModal";
import FirmSwitcher from "../Firms/FirmSwitcher";
import { use } from "react";
import { set } from "date-fns";

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // console.log("selectedTask", selectedTask);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("date");
  const [updateData, setUpdateData] = useState({
    assignedTo: "",
    status: "",
  });
  const [selectedFirmId, setSelectedFirmId] = useState(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.response?.role ;
  const firmId = JSON.parse(localStorage.getItem("authUser")).response.firmId || JSON.parse(localStorage.getItem("authUser")).response.adminId;
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;
  

    //pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

     ////
  //  const filteredUsers = users.filter((user) => {
  //   const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
  //   const email = user.email?.toLowerCase() || "";
  //   const roleName = user?.roleId?.roleName?.toLowerCase() || "";

  //   return (
  //     fullName.includes(searchTerm.toLowerCase()) ||
  //     email.includes(searchTerm.toLowerCase()) ||
  //     roleName.includes(searchTerm.toLowerCase())
  //   );
  // });


  const fetchTasks = async () => {
    try {
      const result = await getTasksByFirmId(idToUse);
      setTasks(result?.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const handleRefetchTasks =() => {
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedFirmId]); 

const filteredTasks = tasks.filter((task) => {
  if (!searchTerm.trim()) return true;

  const term = searchTerm.toLowerCase().replace(/\s/g, ""); // remove all spaces

  // Normalize status
  const normalizedStatus = task.status?.toLowerCase().replace(/\s/g, "");
  if (normalizedStatus?.includes(term)) return true;

  // Check 'assignedTo' (concatenated names)
  if (task.assignedTo?.some((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  })) return true;

  // Check 'date' (createdAt or dueDate)
  const createdAt = new Date(task.createdAt).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  const dueDate = new Date(task.dueDate).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  if (createdAt.includes(term) || dueDate.includes(term)) return true;

  return false;
});


  const fetchUsers = async () => {
    try {
      const result = await getCrmUsers(idToUse);
      setUsers(result?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setUpdateData({
      assignedTo: task.assignedTo[0]?._id || "",
      status: task.status || "",
    });
    setModalOpen(true);
    fetchUsers();
  };


  const handleUpdateTask = async () => {
    if (!selectedTask) return;
  
    const currentAssignees = selectedTask.assignedTo.map(user => user._id.toString());
    const newAssignee = updateData.assignedTo;
  
    if (currentAssignees.includes(newAssignee) && selectedTask.status === updateData.status) {
      setModalOpen(false);
      return;
    }
  
    const addAssignees = currentAssignees.includes(newAssignee) ? [] : [newAssignee];
    const removeAssignees = currentAssignees.filter(id => id !== newAssignee);
  
    try {
      if (addAssignees.length || removeAssignees.length) {
        await updateAssignees(selectedTask._id, {
          addAssignees,
          removeAssignees,
          updatedBy: JSON.parse(localStorage.getItem("authUser")).response._id,
        });
      }
  
      if (selectedTask.status !== updateData.status) {
        await updateTask(selectedTask._id, {
          status: updateData.status,
        });
      }
  
      fetchTasks();
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);
  
  const totalTasks = filteredTasks.length;
  
  const totalPages = Math.ceil(totalTasks / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(currentPage)
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const lastPage = () => setCurrentPage(totalPages);
  const firstPage = () => setCurrentPage(1);

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="CRM" breadcrumbItem="Task Management" />
        <div className="search-bar mb-3 d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-start gap-2 gap-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Date, Assigned To, or Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "300px" }}
          />
           <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",color: "black",transition: "color 0.3s ease"}} onClick={handleRefetchTasks} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
           {role === "client_admin" && (
              <FirmSwitcher
                  selectedFirmId={selectedFirmId}
                  onSelectFirm={setSelectedFirmId}
                />
            )}
            
            <span className="badge bg-primary rounded d-flex align-items-center " style={{marginLeft:"3px",padding:"7px",fontSize:"13px",width:"130px"}}>
              Total Tasks :  {totalTasks}
              </span>
        </div>


        <div className="table-responsive">
          <Table hover bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Created/Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Assigned By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={task._id} onClick={() => {
                  setMainModalOpen(true);
                  setSelectedTask(task);}
                } style={{ cursor: "pointer" }}>
                  <td>{index + 1}</td>
                  <td>{task.remarks[0].message}</td>
                  <td>
                    {new Date(task.createdAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    <br />
                    {new Date(task.dueDate).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>{task.status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                  <td>{task.priority}</td>
                  <td>
                    {task.assignedTo?.map((user) => (
                      <div key={user._id}>
                        {user.firstName} {user.lastName}
                      </div>
                    )) || "N/A"}
                  </td>
                  <td>{task.assignedBy?.firstName + " " + task.assignedBy?.lastName}</td>
                  <td onClick={(e)=>{e.stopPropagation()}}>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <TaskEditModal
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          updateData={updateData}
          setUpdateData={setUpdateData}
          users={users}
          handleUpdateTask={handleUpdateTask}
        />
        <TaskDetailedTableModal
          isOpen={mainModalOpen}
          toggle={() => setMainModalOpen(!mainModalOpen)}
          task={selectedTask}
          loading={false}
          onUpdate={handleUpdateTask}
        />

         {totalPages > 1 && (
                    <div className="pagination-controls d-flex gap-2 mt-2" style={{display:"flex",justifyContent:"start"}}>
                      <Button onClick={firstPage} disabled={currentPage === 1} className="btn-secondary">« First</Button>
                      <Button onClick={prevPage} disabled={currentPage === 1} className="btn-secondary">‹ Prev</Button>
                      <Button onClick={nextPage} disabled={currentPage === totalPages} className="btn-secondary">Next ›</Button>
                      <Button onClick={lastPage} disabled={currentPage === totalPages} className="btn-secondary">Last »</Button>
                    </div>
                  )}
      </div>
      

    </React.Fragment>
  );
}

export default TaskManagement;



