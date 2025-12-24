import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Alert, Pagination, PaginationItem, PaginationLink, Card, Row, Col, CardBody, Input, Modal, ModalHeader, ModalBody, ModalFooter, } from "reactstrap";
import { Link } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
// import PrintFormat from '../../components/InvoicingComponents/printFormat';
import axios from "axios";
import { formatDate } from "../Utility/formatDate";
import FirmSwitcher from "../Firms/FirmSwitcher";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axiosInstance from "../../utils/axiosInstance";
import ViewFormat from "../../components/InvoicingComponents/viewFormat";
import ViewFormat2 from "../../components/InvoicingComponents/viewFormat2";
import ViewFormat3 from "../../components/InvoicingComponents/viewFormat3";
import { ScaleLoader } from "react-spinners";
import InvoicePreviewModal from "../../Modal/InvoicePreviewModal";
import { BackButton } from "../../components/Common/BackButton";
import {rejectInvoiceById} from "../../apiServices/service"

const ViewInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [viewInvoice, setViewInvoice] = useState(null);
    const [selectedFirmId, setSelectedFirmId] = useState(null);
    const [trigger, setTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [invoicesPerPage] = useState(10);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [filter, setFilter] = useState({ clientNameOrInvoice: "", date: "", status: "", paymentStatus: "", amountRange: "", });
    // console.log(invoices[0].firmId.currency);
    const currencyOptions = [
        { value: "INR", label: "₹ INR" },
        { value: "AED", label: "د.إ AED" },
        { value: "SAR", label: "﷼ SAR" },
        { value: "MYR", label: "RM MYR" },
    ];
    const getCurrencySymbol = (currencyCode) => {
        const currency = currencyOptions.find(
            (option) => option.value === currencyCode
        );
        return currency ? currency.value : currencyCode;
    };
    const printRef = useRef();
    const authuser = JSON.parse(localStorage.getItem("authUser")).response;
    const firmId = JSON.parse(localStorage.getItem("authUser")).response.adminId;
    const isDemo = authuser?.isDemo;

    const blockIfDemo = (actionName) => {
    if (isDemo) {
        toast.error(`Demo accounts cannot ${actionName}`);
        return true;
    }
    return false;
    };
    const statusOptions = ["Pending", "Approved", "Rejected"];

    const [previewInvoice, setPreviewInvoice] = useState(null);
    const [previewLayoutId, setPreviewLayoutId] = useState("layout1"); // Default or fetched
    useEffect(() => {
        const savedLayout = localStorage.getItem("selectedInvoiceLayout");
        if (savedLayout) setPreviewLayoutId(savedLayout);
    }, []);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const url =
                    authuser.role === "client_admin"
                        ? `${process.env.REACT_APP_URL}/invoice/get-invoices/${selectedFirmId}`
                        : `${process.env.REACT_APP_URL}/invoice/get-invoices/${firmId}`;

                const response = await axiosInstance.get(url);
                setInvoices(response.data || []);
                // console.log(response?.data[0]?.items[0]?.itemId?.tax?.selectedTaxTypes);
                setFilteredInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
                setInvoices([]);
                setFilteredInvoices([]);
            }
            setLoading(false);
        };

        fetchInvoices();
    }, [trigger, selectedFirmId, authuser.role, firmId]);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = invoices;

            if (filter.clientNameOrInvoice) {
                filtered = filtered.filter(
                    (invoice) =>
                        invoice.customerName
                            .toLowerCase()
                            .includes(filter.clientNameOrInvoice.toLowerCase()) ||
                        invoice.invoiceNumber
                            .toString()
                            .includes(filter.clientNameOrInvoice)
                );
            }

            if (filter.date) {
                const formattedDate = formatDate(filter.date, "yyyy-mm-dd");
                filtered = filtered.filter(
                    (invoice) =>
                        formatDate(invoice.invoiceDate, "yyyy-mm-dd") === formattedDate
                );
            }

            if (filter.status) {
                filtered = filtered.filter((invoice) =>
                    invoice.approvalStatus
                        .toLowerCase()
                        .includes(filter.status.toLowerCase())
                );
            }

            // Filter by payment status (Paid or Due)
            if (filter.paymentStatus) {
                if (filter.paymentStatus === "Paid") {
                    filtered = filtered.filter((invoice) => invoice.amountDue === 0);
                } else if (filter.paymentStatus === "Due") {
                    filtered = filtered.filter((invoice) => invoice.amountDue > 0);
                }
            }

            // Filter by amount range
            if (filter.amountRange) {
                filtered = filtered.filter((invoice) => {
                    const amount = invoice.totalAmount;
                    if (filter.amountRange === "lt1000") return amount < 1000;
                    if (filter.amountRange === "1000-5000")
                        return amount >= 1000 && amount <= 5000;
                    if (filter.amountRange === "5000-10000")
                        return amount > 5000 && amount <= 10000;
                    if (filter.amountRange === "gt10000") return amount > 10000;
                    return true;
                });
            }

            setFilteredInvoices(filtered);
            setCurrentPage(1); // Reset to the first page on filter change
        };

        applyFilters();
    }, [filter, invoices]);

    const fetchInvoice = async (invoiceId) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_URL}/invoice/get-invoice/${invoiceId}`
            );
            const invoice = response.data;
            console.log("All invoices = ", invoice);
            setViewInvoice(response.data);
            setPreviewLayoutId(invoice.invoiceLayout || "layout1");
            setModalOpen(true);
        } catch (error) {
            console.error("Error fetching invoice for viewing:", error);
        }
    };
    const refetchInvoices = () => setTrigger((prev) => prev + 1);
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        onAfterPrint: () => setViewInvoice(null),
    });

    const handleFetchAndPrint = async (invoiceId) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_URL}/invoice/get-invoice/${invoiceId}`
            );
            setSelectedInvoice(response.data);
            setTimeout(() => {
                handlePrint();
            }, 300);
        } catch (error) {
            console.error("Error fetching invoice for printing:", error);
        }
    };
    const handleRejectProforma = async (invoiceId) => {
        if (blockIfDemo("reject an invoice")) return;
        if (!invoiceId) return;
        try {
            const response = await rejectInvoiceById(invoiceId)
            toast.success(response.message);
            console.log("Response de be : " ,response);
            setTrigger((prev) => prev + 1);
        } catch (error) {
            const errorMessage = error.error || "Error rejecting invoice";
            toast.error(errorMessage);
            console.log("error de be : " ,error);
        }
    };

    const handleApproveStatus = async (invoice, status) => {
        if (blockIfDemo("approve or reject an invoice")) return;
        try {
            await axiosInstance.put(
                `${process.env.REACT_APP_URL}/invoice/update-invoice-approval`,
                {
                    id: invoice._id,
                    userId: authuser._id,
                    approvalStatus: status,
                }
            );
            setTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error updating invoice status:", error);
        }
    };

    const handleDueStatus = async (invoiceId, newDueAmount) => {
        if (blockIfDemo("update due status")) return;
        try {
            await axiosInstance.put(
                `${process.env.REACT_APP_URL}/invoice/update-due-status/${invoiceId}`,
                {
                    amountDue: newDueAmount,
                }
            );
            toast.success("Due status updated.");
            setTrigger((prev) => prev + 1); // refresh invoices
        } catch (error) {
            toast.error("Failed to update due status.");
            console.error("Error updating due status:", error);
        }
    };

    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
    const currentInvoices = filteredInvoices.slice(
        (currentPage - 1) * invoicesPerPage,
        currentPage * invoicesPerPage
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="Invoicing" breadcrumbItem="All Invoices" />

                {loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "300px" }}
                    >
                        <ScaleLoader color="#0d4251" />
                    </div>
                ) : (
                    <>
                        <div className="mb-3 align-items-center">
                            <Row form>
                                <Col md={1}>
                                <BackButton/>
                                    
                                </Col>
                                <Col md={3}>
                                    <Input
                                        type="text"
                                        placeholder="Client Name / Invoice ID"
                                        value={filter.clientNameOrInvoice}
                                        onChange={(e) =>
                                            setFilter({
                                                ...filter,
                                                clientNameOrInvoice: e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col md={3}>
                                    <Input
                                        type="date"
                                        placeholder="Date of Invoice"
                                        value={filter.date}
                                        onChange={(e) =>
                                            setFilter({ ...filter, date: e.target.value })
                                        }
                                    />
                                </Col>
                                <Col md={3} sm={6} xs={6}>
                                    <Input
                                        type="select"
                                        value={filter.status}
                                        onChange={(e) =>
                                            setFilter({ ...filter, status: e.target.value })
                                        }
                                    >
                                        <option value="">Select Status</option>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>

                                <Col
                                    md={1}
                                    sm={6}
                                    xs={1}
                                    className="d-flex justify-content-center align-items-center"
                                >
                                    <i
                                        className="bx bx-refresh"
                                        style={{
                                            fontSize: "26px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                        }}
                                        onClick={refetchInvoices}
                                    ></i>
                                </Col>

                                <Col
                                    md={1}
                                    sm={6}
                                    xs={1}
                                    className="d-flex justify-content-center align-items-center position-relative"
                                >
                                    <i
                                        className="bx bx-filter"
                                        style={{
                                            fontSize: "26px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                            marginRight: "80px",
                                        }}
                                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                                    ></i>

                                    {filterDropdownOpen && (
                                        <div
                                            className="position-absolute bg-white shadow p-3"
                                            style={{
                                                top: "35px",
                                                right: "0",
                                                zIndex: 999,
                                                width: "220px",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <div className="mb-2">
                                                <label>Payment Status</label>
                                                <Input
                                                    type="select"
                                                    value={filter.paymentStatus}
                                                    onChange={(e) =>
                                                        setFilter({
                                                            ...filter,
                                                            paymentStatus: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="">All</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Due">Due</option>
                                                </Input>
                                            </div>
                                            <div className="mb-2">
                                                <label>Amount Range</label>
                                                <Input
                                                    type="select"
                                                    value={filter.amountRange}
                                                    onChange={(e) =>
                                                        setFilter({
                                                            ...filter,
                                                            amountRange: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="">All</option>
                                                    <option value="lt1000">&lt; 1000</option>
                                                    <option value="1000-5000">1000 - 5000</option>
                                                    <option value="5000-10000">5000 - 10000</option>
                                                    <option value="gt10000">&gt; 10000</option>
                                                </Input>
                                            </div>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                onClick={() => setFilterDropdownOpen(false)}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-between mt-2">
                                {authuser.role === "client_admin" && (
                                    <FirmSwitcher
                                        selectedFirmId={selectedFirmId}
                                        onSelectFirm={setSelectedFirmId}
                                    />
                                )}
                            </div>
                        </div>
                        {filteredInvoices.length === 0 ? (
                            <Alert color="info">No invoices found.</Alert>
                        ) : (
                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table bordered>
                                            <thead className="table-light">
                                                <tr style={{ fontSize: "12px" }}>
                                                    <th>ID</th>
                                                    <th>Client</th>
                                                    <th>Total</th>
                                                    <th>Due</th>
                                                    <th>Due Status</th>
                                                    <th>Date</th>
                                                    <th>Country</th>
                                                    <th>Status</th>
                                                    {/* <th>Actions</th> */}
                                                    {(authuser.role === "firm_admin" ||
                                                        authuser.role === "client_admin") && (
                                                            <th className="d-flex justify-content-center">
                                                                Approvals
                                                            </th>
                                                        )}
                                                    {(authuser.role === "firm_admin" ||
                                                        authuser.role === "client_admin") && (
                                                            <th style={{ fontSize: "10.5px" }}>
                                                                Actions
                                                            </th>
                                                        )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentInvoices.map((invoice) => (
                                                    <tr
                                                        key={invoice._id}
                                                        onClick={() => {
                                                            setPreviewInvoice(invoice); // This triggers modal open
                                                            fetchInvoice(invoice._id); // This fetches full data
                                                        }}
                                                        style={{ cursor: "pointer", fontSize: "12px" }}
                                                        >
                                                        <td>{invoice.invoiceNumber} <br/>{invoice.invoiceType}</td>
                                                        <td>{invoice.customerName}</td>
                                                        <td>
                                                            {invoice.totalAmount}{" "}
                                                            {invoice.invoiceCurrency ||
                                                                getCurrencySymbol(invoice.firmId.currency) ||
                                                                "INR"}
                                                        </td>
                                                        <td
                                                            style={{
                                                                color: invoice.amountDue > 0 ? "red" : "green",
                                                            }}
                                                        >
                                                            {invoice.amountDue > 0
                                                                ? `${invoice.amountDue} ${invoice.invoiceCurrency ||
                                                                getCurrencySymbol(
                                                                    invoice.firmId.currency
                                                                ) ||
                                                                "INR"
                                                                }`
                                                                : "Paid"}
                                                        </td>
                                                        <td className="text-center">
                                                            {invoice.amountDue !== 0 && (
                                                                <i
                                                                    className="bx bx-x"
                                                                    style={{
                                                                        fontSize: "22px",
                                                                        color: "red",
                                                                        fontWeight: "bold",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    title="Mark as paid"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDueStatus(invoice._id, 0); // mark as paid
                                                                    }}
                                                                ></i>
                                                            )}
                                                            {invoice.amountDue === 0 && (
                                                                <i
                                                                    className="bx bx-check"
                                                                    style={{
                                                                        fontSize: "22px",
                                                                        color: "green",
                                                                        fontWeight: "bold",
                                                                        cursor: "not-allowed",
                                                                    }}
                                                                    title="Already paid"
                                                                ></i>
                                                            )}
                                                        </td>
                                                        <td>{`${new Date(invoice.invoiceDate)
                                                            .getDate()
                                                            .toString()
                                                            .padStart(2, "0")}-${(
                                                                new Date(invoice.invoiceDate).getMonth() + 1
                                                            )
                                                                .toString()
                                                                .padStart(2, "0")}-${new Date(
                                                                    invoice.invoiceDate
                                                                ).getFullYear()}`}</td>
                                                        <td>{invoice.customerAddress.country}</td>
                                                        <td>
                                                            {invoice.approvalStatus
                                                                ?.replace(/[_-]/g, " ")
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </td>
                                                        {/* <td>
                                                            <i
                                                                className="bx bx-printer"
                                                                style={{
                                                                    fontSize: "22px",
                                                                    fontWeight: "bold",
                                                                    cursor: "pointer",
                                                                    marginLeft: "10px",
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFetchAndPrint(invoice._id);
                                                                }}
                                                            ></i>
                                                        </td> */}
                                                        {(authuser.role === "firm_admin" || authuser.role === "client_admin") && (
                                                        <td
                                                            className="d-flex justify-content-center"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <select
                                                            value={invoice.approvalStatus}
                                                            onChange={(e) => handleApproveStatus(invoice, e.target.value)}
                                                            className="form-select form-select-sm"
                                                            style={{ width: "130px" }}
                                                            >
                                                            <option value="pending">Pending</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="rejected">Rejected</option>
                                                            </select>
                                                         </td>
                                                         )}

                                                        {/* {authuser.role === "firm_admin" ||
                                                            (authuser.role === "client_admin" && (
                                                                <td>
                                                                    {invoice.approvalStatus === "pending" ? (
                                                                        <Button
                                                                            style={{ width: "91px" }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRejectProforma(invoice._id);
                                                                            }}
                                                                            color="danger"
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            style={{
                                                                                width: "91px",
                                                                                cursor: "no-drop",
                                                                                pointerEvents: "auto",
                                                                            }}
                                                                            color="success"
                                                                            disabled
                                                                        >
                                                                            Approved
                                                                        </Button>
                                                                    )} */}
                                                                    <td>
                                                                        <i
                                                                            className="bx bx-show"
                                                                            title="View Invoice"
                                                                            style={{
                                                                            fontSize: "22px",
                                                                            fontWeight: "bold",
                                                                            cursor: "pointer",
                                                                            marginRight: "10px",
                                                                            color: "#0d6efd", // default blue
                                                                            transition: "color 0.2s ease-in-out"
                                                                            }}
                                                                            onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setPreviewInvoice(invoice);
                                                                            fetchInvoice(invoice._id);
                                                                            }}
                                                                            onMouseEnter={(e) => e.currentTarget.style.color = "#0b5ed7"} // hover blue
                                                                            onMouseLeave={(e) => e.currentTarget.style.color = "#0d6efd"} // default
                                                                        ></i>
                                                                    <i
                                                                        className="bx bx-printer"
                                                                        style={{
                                                                            fontSize: "22px",
                                                                            fontWeight: "bold",
                                                                            cursor: "pointer",
                                                                            marginLeft: "10px",
                                                                        }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleFetchAndPrint(invoice._id);
                                                                        }}
                                                                    ></i>
                                                                    {!isDemo ? (
                                                                        <Link
                                                                            to={`/edit-invoice/${invoice._id}`}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <i
                                                                            className="bx bx-edit-alt"
                                                                            style={{
                                                                                fontSize: "22px",
                                                                                fontWeight: "bold",
                                                                                cursor: "pointer",
                                                                                marginLeft: "10px",
                                                                            }}
                                                                            title="Edit Invoice"
                                                                            ></i>
                                                                        </Link>
                                                                        ) : (
                                                                        <i
                                                                            className="bx bx-edit-alt"
                                                                            style={{
                                                                            fontSize: "22px",
                                                                            fontWeight: "bold",
                                                                            cursor: "not-allowed",
                                                                            marginLeft: "10px",
                                                                            color: "gray",
                                                                            }}
                                                                            title="Demo accounts cannot edit invoices"
                                                                        ></i>
                                                                    )}
                                                        </td>                                                            
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <Pagination
                                        aria-label="Page navigation example"
                                        style={{ width: "max-content" }}
                                    >
                                        <PaginationItem disabled={currentPage === 1}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                Previous
                                            </PaginationLink>
                                        </PaginationItem>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <PaginationItem
                                                key={index}
                                                active={currentPage === index + 1}
                                            >
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(index + 1)}
                                                    className="text-white bg-theme"
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem disabled={currentPage === totalPages}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                Next
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </CardBody>
                            </Card>
                        )}
                    </>
                )}
            </div>
            {selectedInvoice && (
                <div style={{ display: "none" }}>
                    <div ref={printRef}>
                        {previewLayoutId === "layout1" && (
                            <ViewFormat invoiceData={selectedInvoice} />
                        )}
                        {previewLayoutId === "layout2" && (
                            <ViewFormat2 invoiceData={selectedInvoice} />
                        )}
                        {previewLayoutId === "layout3" && (
                            <ViewFormat3 invoiceData={selectedInvoice} />
                        )}
                    </div>
                </div>
            )}

            {previewInvoice &&
                (viewInvoice ? (
                    <InvoicePreviewModal
                        isOpen={true}
                        invoiceData={viewInvoice}
                        onClose={() => {
                            setPreviewInvoice(null);
                            setViewInvoice(null);
                        }}
                        layoutId={previewLayoutId}
                    />
                ) : (
                    <div className="text-center p-3">
                        <ScaleLoader color="#0d4251" />
                    </div>
                ))}
        </React.Fragment>
    );
};

export default ViewInvoices;
