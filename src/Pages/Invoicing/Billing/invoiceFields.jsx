import React from 'react';
import { Card, CardBody, Row, Col, Input, Label, Button } from 'reactstrap';

function InvoiceFields({ idToUse, invoiceData, setInvoiceData, onGenerateInvoice }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      customerAddress: {
        ...prev.customerAddress,
        [name]: value,
      }
    }));
  };

const handleItemChange = (index, field, value) => {
  const updatedItems = [...invoiceData.items];

  if (field === 'quantity') {
    // Allow empty string while typing
    if (value === '') {
      updatedItems[index][field] = '';
    } else {
      const parsed = parseFloat(value);
      updatedItems[index][field] = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
  } else if (field === 'price' || field === 'tax') {
    const parsed = parseFloat(value);
    updatedItems[index][field] = isNaN(parsed) || parsed < 0 ? 0 : parsed;
  } else {
    updatedItems[index][field] = value;
  }

  setInvoiceData(prev => ({
    ...prev,
    items: updatedItems
  }));
};


  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { itemName: '', price: 0, quantity: 1, tax: 0 }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  return (
    <Card style={{ height: '100%', overflow: 'hidden' }}>
      <CardBody style={{ maxHeight: '100%', overflowY: 'auto' }} >
        {/* Customer Info */}
        <Row className="mt-3">
          <Col md="4">
            <Label> Customer Name <span style={{ color: 'red' }}>*</span> </Label>
            <Input type="text" placeholder='Enter Customer Name' name="customerName" value={invoiceData.customerName} onChange={handleChange} required />
          </Col>
          <Col md="4">
            <Label>Customer Phone</Label>
            <Input type="text" placeholder='Enter Customer Phone' name="customerPhone" value={invoiceData.customerPhone} onChange={handleChange} />
          </Col>
          {/* <Col md="4">
            <Label>Customer Email</Label>
            <Input type="email" name="customerEmail" placeholder='Enter Customer Email' value={invoiceData.customerEmail} onChange={handleChange} />
          </Col> */}
        </Row>

        {/* Address */}
        {/* <Row className="mt-3">
          <Col md="3">
            <Label>Address Line 1</Label>
            <Input type="text" placeholder='Enter Address Line 1' name="h_no" value={invoiceData.customerAddress?.h_no || ''} onChange={handleAddressChange} />
          </Col>
          <Col md="3">
            <Label>City</Label>
            <Input type="text" name="city" placeholder='Enter City' value={invoiceData.customerAddress?.city || ''} onChange={handleAddressChange} />
          </Col>
          <Col md="3">
            <Label>State</Label>
            <Input type="text" name="state" placeholder='Enter State' value={invoiceData.customerAddress?.state || ''} onChange={handleAddressChange} />
          </Col>
          <Col md="3">
            <Label>Zip Code</Label>
            <Input type="text" name="zip_code" placeholder='Enter Zip/Pin Code' value={invoiceData.customerAddress?.zip_code || ''} onChange={handleAddressChange} />
          </Col>
        </Row> */}

        {/* <Row className="mt-3">
          <Col md="6">
            <Label>Country</Label>
            <Input type="text" name="country" placeholder='Enter Country' value={invoiceData.customerAddress?.country || ''} onChange={handleAddressChange} />
          </Col>
        </Row> */}

        {/* Items */}
        <hr />
        <h5 className="mt-4">Items</h5>
        {invoiceData.items.map((item, index) => (
          <Row className="mt-2" key={index}>
            <Col md="3" xs="6">
              <Label>Item Name</Label>
              <Input type="text" placeholder='Enter Item' value={item.itemName} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)} />
            </Col>
            <Col md="2" xs="6">
              <Label>Price</Label>
              <Input type="number" value={item.price} onWheel={(e) => e.target.blur()} onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
            </Col>
            <Col md="2" xs="6">
              <Label>Quantity</Label>
              <Input type="number" min={0} onWheel={(e) => e.target.blur()}  value={item.quantity === '' ? '' : item.quantity}  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
            </Col>
            <Col md="2" xs="6">
              <Label>Tax (%)</Label>
              <Input type="number" value={item.tax} onWheel={(e) => e.target.blur()} onChange={(e) => handleItemChange(index, 'tax', e.target.value)} />
            </Col>
            <Col md="3" className="d-flex align-items-end mt-2 mt-md-0">
              <Button color="danger" onClick={() => removeItem(index)}>Remove</Button>
            </Col>
          </Row>
        ))}
        <div className="mt-3">
          <Button color="primary" onClick={addItem}>Add Item</Button>
        </div>

        {/* Discount + Notes */}
        <Row className="mt-4">
          <Col md="4">
            <Label>Discount Type</Label>
            {/* <Input type="text" name="discountType" value={invoiceData.discountType} onChange={handleChange} /> */}
            <Input type="select" name="discountType" value={invoiceData.discountType} onChange={handleChange}  onWheel={(e) => e.target.blur()} >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat Amount</option>
            </Input>

          </Col>
          <Col md="4" xs="6">
            <Label>Overall Discount</Label>
            <Input type="number" name="overallDiscount" onWheel={(e) => e.target.blur()} value={invoiceData.overallDiscount} onChange={handleChange} />
          </Col>
          <Col md="4" xs="6">
            <Label>Notes</Label>
            <Input type="text" name="notes" value={invoiceData.notes} onChange={handleChange} />
          </Col>
        </Row>
      </CardBody>
      <div className="text-end mt-4 mb-2 px-2 ">
        <Button
          color="primary" 
          className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-semibold rounded shadow"
          style={{ fontSize: '16px' }}
          onClick={onGenerateInvoice}  // <-- Ensure this function is defined!
        >
          <i className="mdi mdi-file-document-outline" style={{ fontSize: '18px' }}></i>
          Generate Bill
        </Button>
      </div>
    </Card>
  );
}

export default InvoiceFields;
