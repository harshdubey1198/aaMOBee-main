const mongoose = require('mongoose');
const Role = require("../schemas/role.schema")
const User = require("../schemas/user.schema");
const Payment = require("../schemas/payment.schema");
const Blog = require("../schemas/blog.schema");

const roleServices = {}

roleServices.createRole = async (body) => {
    const { roleName, description } = body
    const existingRole = await Role.findOne({ roleName: roleName })
    if (existingRole) {
        throw new Error("Role with this name already exists");
    }
    const role = await Role.create({ roleName, description })
    return role
}

// GET ALL ROLES
roleServices.getAllRoles = async () => {
    const roles = await Role.find()
    if (roles.length === 0) {
        throw new Error("No roles found");
    }
    return roles
}

// GET ROLES BY ID
roleServices.getRoleById = async (roleId) => {
    const role = await Role.findOne({ _id: roleId })
    if (!role) {
        throw new Error("No role found");
    }
    return role
}


// UPDATE ROLE
roleServices.updateRole = async (roleId, data) => {
    const updatedRole = await Role.findOneAndUpdate({ _id: roleId }, data, { new: true })
    if (!updatedRole) {
        throw new Error("Role not found or Updation failed");
    }
    return updatedRole
}


// SOFT DELETE ROLE
roleServices.deleteRole = async (roleId) => {
    const deletedRole = await Role.findOneAndUpdate({ _id: roleId }, { deleted_at: new Date() }, { new: true })
    if (!deletedRole) {
        throw new Error("Role not found or Deletion failed");
    }
    return deletedRole
}

roleServices.getDataFSuper = async (id) => {
    const allClient = await User.find({ role: "client_admin" });

    const totalPayments = await Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const totalAmount = totalPayments.length > 0 ? totalPayments[0].totalAmount : 0;

    const activePlanUsers = await User.find({
        role: "client_admin",
        isActive: true,
        planId: { $ne: null }
    });

    // const now = new Date();
    // const expiredUsers = await Payment.aggregate([
    //     {
    //         $match: {
    //             expirationDate: { $lt: now }
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: "$userId"
    //         }
    //     }
    // ]);

    const inactiveClients = await User.find({
        role: "client_admin",
        isActive: false
    });

 // Step 1: Aggregate yearly revenue
        const yearlyRevenue = await Payment.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: { year: { $year: "$paymentDate" } },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1 } }
        ]);

        // Step 2: Format the result
        const formattedYearlyRevenue = yearlyRevenue.map(item => ({
            year: item._id.year,
            totalAmount: item.totalAmount
        }));


    const monthlyRevenue = await Payment.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
                _id: {
                    year: { $year: "$paymentDate" },
                    month: { $month: "$paymentDate" }
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const formattedRevenue = monthlyRevenue.map(item => ({
        year: item._id.year,
        month: monthNames[item._id.month - 1],  // Adjusting index as months start from 1
        totalAmount: item.totalAmount
    }));




    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of current month

    // Count of client_admin users registered today
    const dailyCount = await User.countDocuments({
        role: "client_admin",
        createdAt: { $gte: today }
    });

    // Count of client_admin users registered this month
    const monthlyCount = await User.countDocuments({
        role: "client_admin",
        createdAt: { $gte: firstDayOfMonth }
    });

    const activeBlogs = await Blog.find({ status: 'active', deleted_at: null });


// Fetch blogs written by the user with that author ID
const BlogAdmin = await Blog.distinct('author');

    return {
        TotalAdminClient: allClient.length,
        TotalPaymentReceived: totalAmount,
        ActivePlanCount: activePlanUsers.length,
        //  PlanExpiredUsers: expiredUsers.length,
        InactiveClient: inactiveClients.length,
        YearlyRevenue: formattedYearlyRevenue,
        MonthlyRevenue: formattedRevenue,
        DailyRegisteredUsers: dailyCount,
        MontlyRegisteredUsers: monthlyCount,
        ActiveBlogs: activeBlogs.length,
        BlogAdminCount: BlogAdmin.length,
    };
}

module.exports = roleServices