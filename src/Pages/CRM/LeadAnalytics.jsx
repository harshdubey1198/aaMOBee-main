import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getAllLeads, getLeadsByFirmId } from "../../apiServices/service";
import FirmSwitcher from "../Firms/FirmSwitcher";

function LeadAnalytics() {
    const [leadData, setLeadData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const role = JSON.parse(localStorage.getItem('authUser'))?.response?.role;
    const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.firmId || JSON.parse(localStorage.getItem('authUser'))?.response?.adminId;
    const [selectedFirmId, setSelectedFirmId] = useState(null);
    console.log("selectedFirmId", firmId);
    const idToUse = role === "client_admin" ? selectedFirmId : firmId;
     useEffect(() => {
           const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
           if (defaultFirm && !selectedFirmId) {
               setSelectedFirmId(defaultFirm.firmId);
           }
       }, []);
       useEffect(() => {
           if (firmId || selectedFirmId) {
               fetchLeads();
           }
       }, [firmId, selectedFirmId]);
    const fetchLeads = async () => {
        console.log("Fetching leads for firm ID:", idToUse);
        try {
            const result = await getLeadsByFirmId(idToUse);

            const leads = result?.data || [];
            setLeadData(leads);

            const statusCount = leads.reduce((acc, lead) => {
                acc[lead.status] = (acc[lead.status] || 0) + 1;
                return acc;
            }, {});

            setStatusData(
                Object.keys(statusCount).map((status) => ({
                    name: status,
                    value: statusCount[status],
                }))
            );

            setBarChartData(
                Object.keys(statusCount).map((status) => ({
                    x: status,
                    y: statusCount[status],
                }))
            );
        } catch (error) {
            console.error("Error fetching leads:", error.message);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [idToUse]);

    const handleRefetchLeads = () => {
        fetchLeads();
    };

    const [totalLeads, setTotalLeads] = useState(0);

    useEffect(() => {
        setTotalLeads(leadData.length);
    }, [leadData]);

    const pieChartOptions = {
        chart: {
            type: "pie",
        },
        labels: statusData.map((data) => data.name),
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    const pieChartSeries = statusData.map((data) => data.value);

    const barChartOptions = {
        chart: {
            type: "bar",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: barChartData.map((data) => data.x),
        },
    };

    const barChartSeries = [
        {
            name: "Leads",
            data: barChartData.map((data) => data.y),
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="CRM" breadcrumbItem="Lead Analytics" />
                <div className="button-panel">
                    <span className="text-muted">
                        Total Leads: <strong>{totalLeads}</strong>
                    </span>               
                    <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",marginRight: "10px",color: "black",transition: "color 0.3s ease"}} onClick={handleRefetchLeads} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
                    {(role === "client_admin" && (
                        <FirmSwitcher
                        selectedFirmId={selectedFirmId}
                        onSelectFirm={setSelectedFirmId}
                        />
                     ))}
                </div>
                <Row>
                    <Col md={6}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title">Leads by Status (Pie Chart)</h4>
                                <Chart
                                    options={pieChartOptions}
                                    series={pieChartSeries}
                                    type="pie"
                                    width="100%"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title">Leads by Status (Bar Chart)</h4>
                                <Chart
                                    options={barChartOptions}
                                    series={barChartSeries}
                                    type="bar"
                                    height={350}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
}

export default LeadAnalytics;
