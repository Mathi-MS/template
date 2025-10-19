import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from "../assets/Images/logo.png";

export const downloadInvoicePDF = (
  rows: any[],
  fileName: string,
  invoiceNumber: string = "INV-1001",
  invoiceDate: string = new Date().toLocaleDateString(),
  customerName: string = "John Doe",
  customerAddress: string = "123 Embassy Street, Capital City"
) => {
  const doc = new jsPDF();

  doc.addImage(logoBase64, "PNG", 14, 15, 60, 25);

  // Company Name next to logo (right aligned vertically with logo)

  // Invoice title on right
  doc.setFontSize(18);
  doc.setTextColor("#000");
  doc.text("INVOICE", 160, 20, { align: "right" });

  // Invoice info (number, date)
  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoiceNumber}`, 160, 30, { align: "right" });
  doc.text(`Date: ${invoiceDate}`, 160, 37, { align: "right" });

  // Customer billing info
  doc.setFontSize(12);
  doc.setTextColor("#000");
  doc.setFont("helvetica", "normal");
  doc.text("Bill To:", 14, 55);
  doc.setFont("helvetica", "bold");
  doc.text(customerName, 14, 62);
  doc.setFont("helvetica", "normal");
  doc.text(customerAddress, 14, 69);

  // Line under header
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(14, 75, 196, 75);

  // Table columns
  const columns = [
    { header: "S.No", dataKey: "sno" },
    { header: "Recipient", dataKey: "recipient" },
    { header: "Recipient No", dataKey: "recepientNo" },
    { header: "City", dataKey: "city" },
    { header: "Pickup Location", dataKey: "pickup" },
    { header: "Drop Location", dataKey: "drop" },
    { header: "Cost", dataKey: "cost" },
  ];

  const tableData = rows.map((row, idx) => ({
    sno: idx + 1,
    recipient: row.userId || "-",
    recepientNo: row.mobileNo || "-",
    city: row.city?.cityName || "-",
    pickup: row.pickupLocation?.locationName || "-",
    drop: row.dropLocation?.locationName || "-",
    cost: row.cost != null ? `$${row.cost.toFixed(2)}` : "-",
  }));

  // Data table
  autoTable(doc, {
    startY: 80,
    head: [columns.map((c) => c.header)],
    body: tableData.map((d) => [
      d.sno,
      d.recipient,
      d.recepientNo,
      d.city,
      d.pickup,
      d.drop,
      d.cost,
    ]),
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 10,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [70, 95, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [236, 243, 255],
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor("#888");
  doc.text(
    "Thank you for choosing TTMS. For queries, contact support@ttms.com",
    14,
    pageHeight - 10
  );

  // Save PDF
  doc.save(`${fileName}.pdf`);
};
