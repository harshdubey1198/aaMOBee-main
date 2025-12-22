
export const layoutOptions = {
  invoice: [
    { id: 'layout1', label: 'Layout 1' },
    { id: 'layout2', label: 'Layout 2' },
    { id: 'layout3', label: 'Layout 3' },
  ],
  bill: [
    { id: 'layout1', label: 'Layout 1' },
    { id: 'layout2', label: 'Layout 2' },
    { id: 'layout3', label: 'Layout 3' },
  ]
};

export const currencyOptions = [
  { value: "INR", label: "₹ INR" },
  { value: "AED", label: "د.إ AED" },
  { value: "SAR", label: "﷼ SAR" },
  { value: "MYR", label: "RM MYR" },
];


export const dummyBill = {
  billNumber: 'BILL-001',
  billDate: new Date().toISOString(),
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerAddress: {
    h_no: '123',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zip_code: '400001'
  },
  items: [
    { itemName: 'Product A', quantity: 2, price: 100, tax: 18 },
    { itemName: 'Product B', quantity: 1, price: 200, tax: 18 }
  ],
  overallDiscount: 50,
  discountType: 'flat',
  totalAmount: 468,
  notes: 'Thank you for your purchase!'
};

export const generateDummyInvoice = (firmDetails) => ({
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString(),
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  customerPhone: '+91 9999999999',
  customerAddress: {
    h_no: '789',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    zip_code: '110001'
  },
  items: [
    {
      itemId: {
        name: 'Service A',
        description: 'Basic service package',
        tax: {
          selectedTaxTypes: [{ taxType: 'GST', rate: 18 }]
        }
      },
      quantity: 1,
      sellingPrice: 500,
      discount: 0,
      total: 500
    },
    {
      itemId: {
        name: 'Service B',
        description: 'Premium service package',
        tax: {
          selectedTaxTypes: [{ taxType: 'GST', rate: 18 }]
        }
      },
      quantity: 2,
      sellingPrice: 300,
      discount: 100,
      total: 500
    }
  ],
  amountPaid: 500,
  totalAmount: 1000,
  notes: 'Thank you for your business!',
  firmId: firmDetails
});
