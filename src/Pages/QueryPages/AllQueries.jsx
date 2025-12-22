import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAllContactMessages } from '../../apiServices/service';
import { Spinner, Table, Button, Input, Row, Col } from 'reactstrap';

function AllQueries() {
  const [queries, setQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchQueries = async (page, limit) => {
    try {
      setLoading(true);
      const response = await getAllContactMessages(page, limit);
      if (response && response.data) {
        setQueries(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries(page, limit);
  }, [page, limit]);

  const handlePrevious = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handleRefetch = () => {
    fetchQueries(page, limit);
  };

  // Filter data for search
  const filteredQueries = queries.filter(query =>
    query.name?.toLowerCase().includes(search.toLowerCase()) ||
    query.email?.toLowerCase().includes(search.toLowerCase()) ||
    query.subject?.toLowerCase().includes(search.toLowerCase()) ||
    query.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className='page-content'>
        <Breadcrumbs title='Queries' breadcrumbItem='All Queries' />

        <div className='container'>

          {/* Top Actions */}
          <Row className="align-items-center mb-3">
            <Col md={4} className="mb-2">
              <Input
                type="text"
                placeholder="Search queries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={2} className="mb-2">
              <Input
                type="select"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value="5">5 Items</option>
                <option value="10">10 Items</option>
                <option value="20">20 Items</option>
                <option value="50">50 Items</option>
              </Input>
            </Col>
            <Col md={2}>
             <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",marginRight: "10px",color: "black",transition: "color 0.3s ease"}} onClick={handleRefetch} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center my-5">
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueries.length > 0 ? (
                      filteredQueries.map((query, index) => (
                        <tr key={query._id}>
                          <td>{(page - 1) * limit + (index + 1)}</td>
                          <td>{query.name}</td>
                          <td>{query.email}</td>
                          <td>{query.subject}</td>
                          <td>{query.message}</td>
                          <td>
                            {new Date(query.createdAt).toLocaleDateString()} <br />
                            <span className="text-muted small">
                              {new Date(query.createdAt).toLocaleTimeString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No Queries Found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button color="primary" disabled={page <= 1} onClick={handlePrevious}>
                  Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button color="primary" disabled={page >= totalPages} onClick={handleNext}>
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default AllQueries;
