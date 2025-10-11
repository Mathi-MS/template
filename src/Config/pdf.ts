// src/Config/pdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadTicketSummaryPDF = (rows: any[], fileName: string) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Ticket Summary", 14, 20);

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

  // Table rows
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
    startY: 30,
    head: [columns.map((c) => c.header)],
    body: tableData.map((d) => [d.sno,d.recipient, d.recepientNo, d.city, d.pickup, d.drop, d.cost]),

    // ✅ Apply colors and styling
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 10,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [70, 95, 255], // --primary (#465fff)
      textColor: [255, 255, 255], // white text
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [236, 243, 255], // --secondary (#ecf3ff)
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
  });

  // Save the file
  doc.save(`${fileName}.pdf`);
};
