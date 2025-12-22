const CRMUser = require("../schemas/crmUser.schema");
const Lead = require("../schemas/lead.schema");
const Task = require("../schemas/task.schema");
const User = require("../schemas/user.schema");

const taskServices = {};

const isSM = async (userId) => {
  const user = await CRMUser.findById(userId).populate("roleId");
  return user && user.roleId && user.roleId.roleName === "SM";
};

const isTelecaller = async (userId) => {
  const user = await CRMUser.findById(userId).populate("roleId");
  return user && user.roleId && user.roleId.roleName === "Telecaller";
};

taskServices.updateLeadStatus = async (leadId) => {
  const tasks = await Task.find({ leadId });
  if (!tasks || tasks.length === 0) {
    await Lead.findByIdAndUpdate(leadId, { status: "Pending" });
    return;
  }

  const allCompleted = tasks.every((task) => task.status === "Completed");
  const allMissed = tasks.every((task) => task.status === "Missed");
  const anyInProgress = tasks.some((task) => task.status === "In Progress");
};

taskServices.createTask = async (body) => {
  const {
    leadIds,
    assignedTo = [],
    assignedBy,
    status,
    dueDate,
    firmId,
    remarks,
    priority
  } = body;

  const assignedByCRM = await CRMUser.findById(assignedBy).populate("roleId");
    let userRole = null;

    if (assignedByCRM && assignedByCRM.roleId) {
      userRole = assignedByCRM.roleId.roleName;
    } else {
      const assignedByUser = await User.findById(assignedBy);
      if (!assignedByUser || !assignedByUser.role) {
        throw new Error("AssignedBy user not found or missing role.");
      }
      userRole = assignedByUser.role.toLowerCase(); 
    }
  console.log(userRole);
  
  if (userRole === "firm_admin" || userRole === "client_admin") {
      // No restriction on assignedTo roles
      console.log("Assigned to roles are not restricted for firm_admin or client.");
    } else if (userRole === "ASM") {
      // ASM can assign to SMs only
      for (const userId of assignedTo) {
        if (!(await isSM(userId))) {
          throw new Error("ASM can only assign tasks to SMs.");
        }
      }
    } else if (userRole === "SM") {
      // SM can assign to Telecallers only
      for (const userId of assignedTo) {
        if (!(await isTelecaller(userId))) {
          throw new Error("SM can only assign tasks to Telecallers.");
        }
      }
    } else {
      throw new Error("Only ASM, SM, firm_admin, or client can assign tasks.");
    }

  const duplicateLeadIds = leadIds.filter(
    (id, index, array) => array.indexOf(id) !== index
  );
  if (duplicateLeadIds.length > 0) {
    throw new Error(
      `Duplicate Lead IDs found: ${[...new Set(duplicateLeadIds)].join(", ")}`
    );
  }

  const leads = await Promise.all(
    leadIds.map(async (leadId) => {
      const lead = await Lead.findOne({ _id: leadId });
      if (!lead) {
        throw new Error(`Invalid Lead ID or Lead is deleted: ${leadId}`);
      }
      return lead;
    })
  );

  if (dueDate) {
    const taskDueDate = new Date(dueDate);
    for (const lead of leads) {
      if (lead.dueDate && taskDueDate > new Date(lead.dueDate)) {
        throw new Error(
          `Task due date cannot be greater than the due date of lead: ${lead._id}`
        );
      }
    }
    if (taskDueDate < new Date()) {
      throw new Error("Task due date must be in the future.");
    }
  }

  const newTask = new Task({
    leadIds,
    assignedTo,
    assignedBy,
    priority,
    firmId,
    status: status || "Pending",
    dueDate: dueDate || null,
    remarks: remarks || [],
  });

  const savedTask = await newTask.save();

  await Promise.all(
    leadIds.map(async (leadId) => {
      const lead = await Lead.findById(leadId);
      lead.status = "Assigned";
      lead.assignmentHistory.push({
        assignedBy: assignedBy,
        assignedTo: assignedTo,
        assignedAt: new Date(),
      });
      await lead.save();
    })
  );

  return savedTask;
};

taskServices.getAllTasks = async () => {
  const tasks = await Task.find()
    .populate("leadIds")
    .populate({
      path: "assignedTo",
      select: "firstName lastName email role",
    });

  if (tasks.length === 0) {
    throw new Error("No task to show");
  }

  const populatedTasks = await Promise.all(
    tasks.map(async (task) => {
      let assignedByUser = await CRMUser.findById(task.assignedBy).select("firstName lastName email role");

      if (!assignedByUser) {
        assignedByUser = await User.findById(task.assignedBy).select("firstName lastName email role");
      }

      const processedRemarks = await Promise.all(
        task.remarks.map(async (remark) => {
          let createdByUser = await CRMUser.findById(remark.createdBy).select("firstName lastName email role");
          if (!createdByUser) {
            createdByUser = await User.findById(remark.createdBy).select("firstName lastName email role");
          }
          return {
            ...remark.toObject(),
            createdBy: createdByUser || null,
          };
        })
      );

      return {
        ...task.toObject(),
        assignedBy: assignedByUser || null,
        remarks: processedRemarks,
      };
    })
  );

  return populatedTasks;
};


taskServices.getTaskById = async (taskId) => {
  const task = await Task.findOne({ _id: taskId })
    .populate("leadIds")
    .populate({
      path: "assignedTo",
      select: "firstName lastName email role"
    })
    .populate({
      path: "remarks.createdBy",
      select: "firstName lastName email role"
    });

  if (!task) {
    throw new Error("No task to show");
  }

  let assignedByUser = await CRMUser.findById(task.assignedBy).select("firstName lastName email role");

  if (!assignedByUser) {
    assignedByUser = await User.findById(task.assignedBy).select("firstName lastName email role");
  }

  const populatedTask = {
    ...task.toObject(),
    assignedBy: assignedByUser || null,
  };

  return populatedTask;
};

taskServices.getTaskByFirmId = async (firmId) => {
  const tasks = await Task.find({ firmId })
    .populate("leadIds")
    .populate({
      path: "assignedTo",
      select: "firstName lastName email role"
    });

  const populatedTasks = await Promise.all(tasks.map(async (task) => {
    // Handle assignedBy (CRMUser or User)
    let assignedByUser = await CRMUser.findById(task.assignedBy).select("firstName lastName email role");
    if (!assignedByUser) {
      assignedByUser = await User.findById(task.assignedBy).select("firstName lastName email role");
    }

    // Handle remarks.createdBy (CRMUser or User)
    const processedRemarks = await Promise.all(
      task.remarks.map(async (remark) => {
        let createdByUser = await CRMUser.findById(remark.createdBy)
        .select("firstName lastName email roleId")
        .populate("roleId", "roleName");        
        if (!createdByUser) {
          createdByUser = await User.findById(remark.createdBy).select("firstName lastName email role");
        }
        return {
          ...remark.toObject(),
          createdBy: createdByUser || null,
        };
      })
    );

    return {
      ...task.toObject(),
      assignedBy: assignedByUser || null,
      remarks: processedRemarks,
    };
  }));

  return populatedTasks;
};


taskServices.updateTask = async (taskId, updates) => {
  const { status, dueDate, remarks } = updates;

  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  // Update status
  if (status) {
    if (
      ![
        "pending",
        "completed",
        "inProgress",
        "missed",
        "overdue",
        "failed",
      ].includes(status)
    ) {
      throw new Error("Invalid status value");
    }
    task.status = status;
  }

  // Update dueDate
  if (dueDate) {
    if (new Date(dueDate) < new Date()) {
      throw new Error("Due date must be in the future");
    }
    task.dueDate = new Date(dueDate);
  }

  // Add remarks
  if (remarks) {
    task.remarks.push({
      message: remarks.message,
      createdBy: remarks.createdBy,
    });
  }

  const updatedTask = await task.save();
  return updatedTask;
};

// taskServices.updateAssignees = async (taskId, body) => {
//   const { addAssignees = [], removeAssignees = [], updatedBy } = body;

//   const task = await Task.findById(taskId);
//   if (!task) throw new Error("Task not found");

//   const uniqueUserIds = [...new Set([...addAssignees, ...removeAssignees])];
//   const users = await CRMUser.find({ _id: { $in: uniqueUserIds } }).select(
//     "firstName lastName"
//   );

//   const userIdToNameMap = users.reduce((map, user) => {
//     map[user._id.toString()] = `${user.firstName} ${user.lastName}`;
//     return map;
//   }, {});

//   const addedNames = [];
//   for (const userId of addAssignees) {
//     if (!task.assignedTo.includes(userId)) {
//       task.assignedTo.push(userId);
//       addedNames.push(userIdToNameMap[userId]);
//     }
//   }

//   const removedNames = [];
//   task.assignedTo = task.assignedTo.filter((userId) => {
//     if (removeAssignees.includes(userId.toString())) {
//       removedNames.push(userIdToNameMap[userId]);
//       return false;
//     }
//     return true;
//   });

//   task.remarks.push({
//     message: `Updated assignees: Added [${addedNames.join(
//       ", "
//     )}], Removed [${removedNames.join(", ")}]`,
//     createdBy: updatedBy,
//   });

//   const updatedTask = await task.save();
//   return updatedTask;
// };


taskServices.updateAssignees = async (taskId, body) => {
  const { addAssignees = [], removeAssignees = [], updatedBy } = body;

  const task = await Task.findById(taskId).populate("leadIds");
  if (!task) throw new Error("Task not found");

  const uniqueUserIds = [...new Set([...addAssignees, ...removeAssignees])];
  const users = await CRMUser.find({ _id: { $in: uniqueUserIds } }).select("firstName lastName");

  const userIdToNameMap = users.reduce((map, user) => {
    map[user._id.toString()] = `${user.firstName} ${user.lastName}`;
    return map;
  }, {});

  const addedNames = [];

  for (const userId of addAssignees) {
    if (!task.assignedTo.includes(userId)) {
      task.assignedTo.push(userId);
      addedNames.push(userIdToNameMap[userId]);

      // Add to each lead's assignment history
      for (const lead of task.leadIds) {
        await Lead.findByIdAndUpdate(
          lead._id,
          {
            $push: {
              assignmentHistory: {
                assignedBy: updatedBy,
                assignedTo: userId,
                assignedAt: new Date(),
              },
            },
          },
          { new: true }
        );
      }
    }
  }

  const removedNames = [];
  task.assignedTo = task.assignedTo.filter((userId) => {
    if (removeAssignees.includes(userId.toString())) {
      removedNames.push(userIdToNameMap[userId]);
      return false;
    }
    return true;
  });

  task.remarks.push({
    message: `Updated assignees: Added [${addedNames.join(", ")}], Removed [${removedNames.join(", ")}]`,
    createdBy: updatedBy,
  });

  const updatedTask = await task.save();
  return updatedTask;
};

taskServices.markMissedTasks = async () => {
  const missedTasks = await Task.find({
    status: { $in: ["Pending", "In Progress"] },
    dueDate: { $lte: new Date() },
  }).populate("assignedTo", "firstName lastName email");

  const updates = [];
  for (const task of missedTasks) {
    task.remarks.push({
      message: `Task missed by ${task.assignedTo
        .map((user) => user.firstName + " " + user.lastName)
        .join(", ")}`,
      createdAt: new Date(),
      createdBy: null,
    });
    task.status = "Missed";
    updates.push(task.save());
  }

  await Promise.all(updates);
  return missedTasks;
};


taskServices.getTasksByAssignee = async (userId) => {
  const tasks = await Task.find({ assignedTo: userId })
    .populate("leadIds")
    .populate({
      path: "assignedTo",
      select: "firstName lastName email roleId",
      populate: { path: "roleId", select: "roleName" },
    });

  if (!tasks.length) throw new Error("No tasks assigned to this user");

  const populatedTasks = await Promise.all(
    tasks.map(async (task) => {
      // Resolve assignedBy
      let assignedByUser =
        (await CRMUser.findById(task.assignedBy)
          .select("firstName lastName email roleId")
          .populate("roleId", "roleName")) ||
        (await User.findById(task.assignedBy).select("firstName lastName email role"));

      // Resolve remarks.createdBy
      const processedRemarks = await Promise.all(
        task.remarks.map(async (remark) => {
          let createdBy =
            (await CRMUser.findById(remark.createdBy)
              .select("firstName lastName email roleId")
              .populate("roleId", "roleName")) ||
            (await User.findById(remark.createdBy).select("firstName lastName email role"));

          return {
            ...remark.toObject(),
            createdBy: createdBy || null,
          };
        })
      );

      // Process each lead
      const processedLeads = await Promise.all(
        task.leadIds.map(async (lead) => {
          const history = await Promise.all(
            (lead.assignmentHistory || []).map(async (entry) => {
              const assignedBy =
                (await CRMUser.findById(entry.assignedBy)
                  .select("firstName lastName email roleId")
                  .populate("roleId", "roleName")) ||
                (await User.findById(entry.assignedBy).select("firstName lastName email role"));

              const assignedTo =
                (await CRMUser.findById(entry.assignedTo)
                  .select("firstName lastName email roleId")
                  .populate("roleId", "roleName")) ||
                (await User.findById(entry.assignedTo).select("firstName lastName email role"));

              return {
                ...entry.toObject(),
                assignedBy,
                assignedTo,
              };
            })
          );

          return {
            ...lead.toObject(),
            assignmentHistory: history,
          };
        })
      );

      return {
        ...task.toObject(),
        assignedBy: assignedByUser || null,
        remarks: processedRemarks,
        leadIds: processedLeads,
      };
    })
  );

  return populatedTasks;
};


module.exports = taskServices;
