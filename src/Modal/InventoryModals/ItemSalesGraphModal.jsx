import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Button, Table } from "reactstrap";
import ApexCharts from "react-apexcharts";
import { getItemSalesData } from "../../apiServices/service";

const ItemSalesGraphModal = ({ itemId, isOpen, toggleModal }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallItemsSold, setOverallItemsSold] = useState(0);
  const [overallRevenue, setOverallRevenue] = useState(0);
  const [backlogs, setBacklogs] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchSalesData = async () => {
    try {
      const data = await getItemSalesData(itemId);
      const formattedData = formatSalesData(data.data.salesGraph, data.data.backlogs);
      setSalesData(formattedData);
      setOverallItemsSold(data.data.overallItemsSold);
      setOverallRevenue(data.data.overallRevenue);
      setBacklogs(data.data.backlogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && itemId) {
      fetchSalesData();
    }
  }, [isOpen, itemId]);

  const formatSalesData = (sales, backlogsFromAPI) => {
    const groupedSales = {};

    // Group sales by date
    sales.forEach((sale) => {
      const { date, quantitySold, revenue, profit, invoiceNumber } = sale;

      if (!groupedSales[date]) {
        groupedSales[date] = {
          quantitySold: 0,
          revenue: 0,
          profit: 0,
          invoiceCount: 0,
          invoiceNumbers: [], // To store invoice numbers for each date
          invoiceDetails: [] // To store full invoice details for pagination
        };
      }

      groupedSales[date].quantitySold += quantitySold;
      groupedSales[date].revenue += revenue;
      groupedSales[date].profit += profit;
      groupedSales[date].invoiceCount += 1;
      groupedSales[date].invoiceNumbers.push(invoiceNumber); // Collect invoice numbers
      groupedSales[date].invoiceDetails.push(sale); // Collect full invoice details
    });

    // Return the grouped sales data
    const formatted = Object.keys(groupedSales).map((date) => {
      const data = groupedSales[date];
      return {
        date,
        quantitySold: data.quantitySold,
        revenue: data.revenue,
        profit: data.profit,
        invoiceCount: data.invoiceCount,
        invoiceNumbers: data.invoiceNumbers, // Include invoice numbers for tooltip
        invoiceDetails: data.invoiceDetails, // Store full invoice details for that date
      };
    });

    // Set the backlogs count as per API response
    setBacklogs(backlogsFromAPI);

    return formatted;
  };

  const chartData = {
    options: {
      chart: {
        id: "sales-graph",
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true, // Enable zooming
          type: 'xy',
        },
      },
      xaxis: {
        categories: salesData.map((sale) => sale.date),
        title: {
          text: "Date",
        },
      },
      yaxis: [
        {
          title: {
            text: "Amount",
          },
          min: 0,
        },
        {
          title: {
            text: "Profit",
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          const sale = salesData[dataPointIndex];
          const revenue = series[0][dataPointIndex];
          const profit = series[1][dataPointIndex];
          const quantitySold = sale.quantitySold;
          const invoiceCount = sale.invoiceCount;
          const invoiceNumbers = sale.invoiceNumbers.join(', '); // Show invoice numbers

          // Update selectedDate when hovering over a data point
          setSelectedDate(sale.date);

          return (
            `<div class="tooltip-custom">
              <strong>Date:</strong> ${sale.date}<br>
              <strong>Revenue:</strong> ₹${revenue}<br>
              <strong>Profit:</strong> ₹${profit}<br>
              <strong>Quantity Sold:</strong> ${quantitySold} units<br>
              <strong>Invoices Count:</strong> ${invoiceCount}<br>
            </div>`
          );
        },
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 5,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
    },
    series: [
      {
        name: "Revenue",
        data: salesData.map((sale) => sale.revenue),
      },
      {
        name: "Profit",
        data: salesData.map((sale) => sale.profit),
        yaxisIndex: 1,
      },
    ],
  };

  // Pagination Logic for invoices
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(
    selectedDate ? salesData.find((sale) => sale.date === selectedDate).invoiceDetails.length / itemsPerPage : 0
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentItems = selectedDate
    ? salesData.find((sale) => sale.date === selectedDate).invoiceDetails.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="xl">
      <ModalHeader toggle={toggleModal}>Item Sales Graph</ModalHeader>
      <ModalBody>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="stats-summary">
              <p><strong>Overall Items Sold:</strong> {overallItemsSold}</p>
              <p><strong>Overall Revenue:</strong> ₹{overallRevenue}</p>
              <p><strong>Backlogs:</strong> {backlogs} units</p>
            </div>
            <ApexCharts
              options={chartData.options}
              series={chartData.series}
              type="line"
              height="400"
            />

            {selectedDate && (
              <div>
                <h4>Invoices on {selectedDate}</h4>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Invoice Number</th>
                      <th>Items Sold</th>
                      <th>Revenue Per Sale</th>
                      <th>Profit</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((invoice, index) => (
                        <tr key={index}>
                          <td>{invoice.invoiceNumber}</td>
                          <td>{invoice.quantitySold}</td>
                          <td>{invoice.revenue}</td>
                          <td>{invoice.profit}</td>
                          <td>{invoice.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No invoices found for this date.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div className="pagination-controls d-flex gap-2 mt-2">
                  {pageNumbers.map(number => (
                    <Button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? "btn-primary" : "btn-secondary"}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ItemSalesGraphModal;
