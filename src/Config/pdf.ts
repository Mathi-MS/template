import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from "../assets/Images/logo.png";

export const downloadInvoicePDF = (
  rows: any[],
  fileName: string,
  invoiceNumber: string = "INV-1001",
  invoiceDate: string = new Date().toLocaleDateString(),
  vendorInfo: any = null,
  cityInfo: any = null,
  customerAddress: string = "123 Embassy Street, Capital City"
) => {
  const doc = new jsPDF();

  // --- Logo ---
  doc.addImage(logoBase64, "PNG", 14, 15, 60, 25);

  // --- Header ---
  doc.setFontSize(18);
  doc.text("INVOICE", 160, 20, { align: "right" });

  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoiceNumber}`, 160, 30, { align: "right" });
  doc.text(`Date: ${invoiceDate}`, 160, 37, { align: "right" });

  // --- Vendor & City Info ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Bill To:", 14, 55);
  doc.setFont("helvetica", "bold");

  const vendorName = vendorInfo?.vendorName || "N/A";
  const cityName = cityInfo?.cityName || "N/A";

  doc.text(`${vendorName}`, 14, 62);
  doc.setFont("helvetica", "normal");
  doc.text(`City: ${cityName}`, 14, 69);

  // --- Line under header ---
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(14, 82, 196, 82);

  // --- Table Columns ---
  const columns = [
    { header: "S.No", dataKey: "sno" },
    { header: "Recipient", dataKey: "recipient" },
    { header: "City", dataKey: "city" },
    { header: "Pickup Location", dataKey: "pickup" },
    { header: "Drop Location", dataKey: "drop" },
    { header: "Start Date", dataKey: "startDate" },
    { header: "Start Time", dataKey: "startTime" },
    { header: "End Date", dataKey: "endDate" },
    { header: "End Time", dataKey: "endTime" },
    { header: "Cost", dataKey: "cost" },
  ];

  // --- Format Date and Time ---
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // --- Prepare Table Data ---
  const tableData = rows.map((row, idx) => ({
    sno: idx + 1,
    recipient: row.userName || "-",
    city: row.city?.cityName || "-",
    pickup: row.pickupLocation?.locationName || "-",
    drop: row.dropLocation?.locationName || "-",
    startDate: formatDate(row.rideStartTime),
    startTime: formatTime(row.rideStartTime),
    endDate: formatDate(row.rideEndTime),
    endTime: formatTime(row.rideEndTime),
    cost: row.cost != null ? `$${row.cost.toFixed(2)}` : "-",
  }));

  // --- Calculate Total Cost ---
  const totalCost = rows.reduce((acc, row) => acc + (row.cost || 0), 0);

  // --- Table ---
  autoTable(doc, {
    startY: 85,
    head: [columns.map((c) => c.header)],
    body: tableData.map((d) => [
      d.sno,
      d.recipient,
      d.city,
      d.pickup,
      d.drop,
      d.startDate,
      d.startTime,
      d.endDate,
      d.endTime,
      d.cost,
    ]),
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 9,
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
    columnStyles: {
      sno: { cellWidth: 10 },
      recipient: { cellWidth: 20 },
      city: { cellWidth: 20 },
      pickup: { cellWidth: 25 },
      drop: { cellWidth: 25 },
      startDate: { cellWidth: 20 },
      startTime: { cellWidth: 20 },
      endDate: { cellWidth: 20 },
      endTime: { cellWidth: 20 },
      cost: { cellWidth: 20 },
    },
  });

  // --- Add Styled Total Box ---
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  // Draw a light background box
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(130, finalY - 8, 65, 12, 2, 2, "F");

  // Add total cost text
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Cost: $${totalCost.toFixed(2)}`, 190, finalY, {
    align: "right",
  });

  // --- Footer ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor("#888");
  doc.text(
    "Thank you for choosing TTMS. For queries, contact support@ttms.com",
    14,
    pageHeight - 10
  );

  // --- Save PDF ---
  doc.save(`${fileName}.pdf`);
};
