const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const moment = require('moment');

// index increment
handlebars.registerHelper('inc', (value) => parseInt(value) + 1);

// format date (23-Sep-2025)
handlebars.registerHelper('formatDate', (date) => {
  return date ? moment(date).format("DD-MMM-YYYY") : '';
});

// multiply qty × price
handlebars.registerHelper('multiply', (a, b) => {
  return ((Number(a) || 0) * (Number(b) || 0)).toFixed(2);
});

// per-item tax amount
handlebars.registerHelper('calcTaxAmount', function (qty, unitPrice, rate) {
  const base = (Number(qty) || 0) * (Number(unitPrice) || 0);
  return (base * (Number(rate) / 100)).toFixed(2);
});

handlebars.registerHelper('calcFinalAmount', function (qty, unitPrice, taxComponents, discount) {
  const q = Number(qty) || 0;
  const price = Number(unitPrice) || 0;
  const base = q * price;

  const taxRate = (taxComponents || []).reduce(
    (sum, t) => sum + Number(t.rate ?? t.taxRate ?? 0),
    0
  );
  const taxAmount = base * (taxRate / 100);

  const disc = Number(discount) || 0;

  return (base + taxAmount - disc).toFixed(2);
});

function numberToWords(num) {
  if (num === 0) return 'Zero';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
    if (n < 1000000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
    if (n < 1000000000) return inWords(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + inWords(n % 1000000) : '');
    return inWords(Math.floor(n / 1000000000)) + ' Billion' + (n % 1000000000 ? ' ' + inWords(n % 1000000000) : '');
  }

  return inWords(num);
}

function calculateInvoiceTotalsFromItems(items, amountPaid = 0) {
  // Subtotal = sum of (unitPrice * qty) only
  const subtotal = items.reduce((acc, item) => acc + (Number(item.unitPrice) || 0) * (Number(item.qty) || 0), 0);

  // Total Tax = sum of per-item tax amounts
  const totalTaxAmount = items.reduce((acc, item) => {
    const baseTotal = (Number(item.unitPrice) || 0) * (Number(item.qty) || 0);
    const taxRate = (item.taxComponents || []).reduce((sum, t) => sum + Number(t.rate ?? t.taxRate ?? 0), 0);
    return acc + baseTotal * (taxRate / 100);
  }, 0);

  // Total Discount = sum of discounts
  const totalDiscount = items.reduce((acc, item) => acc + (Number(item.discount) || 0), 0);

  // Grand Total = subtotal + tax - discount
  const grandTotal = subtotal + totalTaxAmount - totalDiscount;

  const balance = grandTotal - (Number(amountPaid) || 0);

  return {
    subtotal: subtotal.toFixed(2),
    totalTaxAmount: totalTaxAmount.toFixed(2),
    totalDiscount: totalDiscount.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
    amountPaid: (Number(amountPaid) || 0).toFixed(2),
    balance: balance.toFixed(2),
  };
}

// 🔹 Normalize items so template fields are consistent
function normalizeInvoiceItems(invoice) {
  return (invoice.items || []).map((item) => {
    const basePrice = Number(item.sellingPrice) || 0;

    // Sum of selected variant prices (if any)
    const variantPrice = (item.selectedVariant || []).reduce(
      (acc, v) => acc + (Number(v.price) || 0),
      0
    );

    const unitPrice = basePrice + variantPrice; // include variant

    const qty = Number(item.quantity) || 0;
    const base = qty * unitPrice;

    // Use taxComponents if available, else fallback to item.tax
    const taxComponents = (item.taxComponents && item.taxComponents.length > 0)
      ? item.taxComponents
      : item.tax ? [{ taxName: 'Tax', rate: Number(item.tax) }] : [];

    const taxAmount = taxComponents.reduce(
      (acc, t) => acc + base * (Number(t.rate ?? t.taxRate ?? 0) / 100),
      0
    );

    const discount = Number(item.discount) || 0;

    return {
      name: item.name || item.itemId?.name || 'N/A',
      description: item.description || item.itemId?.description || '',
      hsn: item.ProductHsn || item.itemId?.ProductHsn || '-',
      qty,
      qtyType: item.qtyType || '',
      unitPrice: unitPrice.toFixed(2),
      variantPrice: variantPrice.toFixed(2),
      taxComponents,
      discount: discount.toFixed(2),
      total: (base + taxAmount - discount).toFixed(2),
      variant: item.selectedVariant?.map(v => v.optionLabel).join(', ') || null,
    };
  });
}

async function generateInvoicePdf(invoice, firm, layout = 'layout1') {
  const templatePath = path.join(__dirname, `../templates/${layout}.hbs`);
  const templateHtml = fs.readFileSync(templatePath, 'utf8');

  // Normalize + calculate totals
  // Normalize items first
  const items = normalizeInvoiceItems(invoice);

  // Calculate totals using normalized items
  const totals = calculateInvoiceTotalsFromItems(items, invoice.amountPaid || 0);

  // Add amount in words
  totals.amountInWords = numberToWords(Math.floor(Number(totals.grandTotal) || 0)) + ' Only';


  // 🔹 Add this block here
  const termsArray = (invoice.termsAndConditions || '')
    .split(/\r?\n/)
    .filter(line => line.trim() !== ''); // remove empty lines

  invoice.terms = invoice.termsAndConditions || '';
  invoice.termsArray = termsArray;


  const template = handlebars.compile(templateHtml);

  const html = template({
    invoice: { ...invoice, ...totals, items },
    firm,
    currency: invoice.invoiceCurrency || firm.currency || '₹',
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generateInvoicePdf };
