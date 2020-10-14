const pdfDoc = require('pdfkit')
const pdfTable = require('voilab-pdf-table')
const fs = require('fs')
const path = require('path');

exports.generatePDF = async(order) => {
    
    let doc = new pdfDoc({ margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, order);
    generateInvoiceTable(doc, order);
    generateFooter(doc);

    doc.end();
    return doc
        //pdf.pipe(fs.createWriteStream(file))
}

function generateHeader(doc) {
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("AGORE")
      .fontSize(10)
      .text("123 Main Street", 200, 65, { align: "right" })
      .text("New York, NY, 10025", 200, 80, { align: "right" })
      .moveDown();
}

function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
}

function generateCustomerInformation(doc, order) {

    doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Order", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
    .fontSize(10)
    .text("Order ID:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(order.orderId, 150, customerInformationTop)
    .font("Helvetica")
    .text("Order Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(0),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(order.user.name, 300, customerInformationTop)
    .font("Helvetica")
    .text('invoice.shipping.address', 300, customerInformationTop + 15)
    .text(
      'Wiaam' +
        ", " +
        'Sidi-Bel-Abbes' +
        ", " +
        'Algeria',
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
  
}

function generateInvoiceTable(doc, order) {
    let i;
    const invoiceTableTop = 330;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Item",
      "Unit Cost",
      "Quantity",
      "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
  
    for (i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.product.title,
        item.product.price,
        item.quantity,
        formatCurrency(item.product.price * item.quantity)
      );
  
      generateHr(doc, position + 20);
}

const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Total",
    formatCurrency(order.total)
  );

}

function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
}

function generateTableRow(
    doc,
    y,
    item,
    unitCost,
    quantity,
    lineTotal
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
}

function formatCurrency(cents) {
    return ((cents * 100) / 100).toFixed(2) + " DZD";
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return year + "/" + month + "/" + day;
}