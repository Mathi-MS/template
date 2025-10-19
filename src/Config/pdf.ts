import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from "../assets/Images/logo.png";

export const downloadInvoicePDF = (
  rows: any[],
  fileName: string,
  invoiceNumber: string = "INV-1001",
  invoiceDate: string = new Date().toLocaleDateString(),
  vendorInfo: any = null, // optional vendor info
  cityInfo: any = null, // optional city info
  customerAddress: string = "123 Embassy Street, Capital City"
) => {
  const doc = new jsPDF();

  // Logo
  doc.addImage(logoBase64, "PNG", 14, 15, 60, 25);

  // Invoice title & info
  doc.setFontSize(18);
  doc.setTextColor("#000");
  doc.text("INVOICE", 160, 20, { align: "right" });

  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoiceNumber}`, 160, 30, { align: "right" });
  doc.text(`Date: ${invoiceDate}`, 160, 37, { align: "right" });

  // Vendor & City Info (Bill To)
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Bill To:", 14, 55);
  doc.setFont("helvetica", "bold");

  const vendorName = vendorInfo?.vendorName || "N/A";
  const cityName = cityInfo?.cityName || "N/A";

  doc.text(`${vendorName}`, 14, 62);
  doc.setFont("helvetica", "normal");
  doc.text(`City: ${cityName}`, 14, 69);

  // Line under header
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(14, 82, 196, 82);

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

  autoTable(doc, {
    startY: 85,
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

  doc.save(`${fileName}.pdf`);
};

