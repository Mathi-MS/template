import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from "../assets/Images/logo.png";

export const downloadInvoicePDF = (
  rows: any[],
  fileName: string,
  invoiceNumber: string = "INV-1001",
  vendorInfo: any = null,
  cityInfo: any = null
) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  console.log(cityInfo);
  

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 40;

  // -------------------------
  // HEADER
  // -------------------------
  try {
    doc.addImage(logoBase64, "PNG", marginLeft, 30, 110, 45);
  } catch (_) {}

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", pageWidth - marginLeft, 48, { align: "right" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${invoiceNumber}`, pageWidth - marginLeft, 70, {
    align: "right",
  });

  // -------------------------
  // BILLING INFO
  // -------------------------
  const billToTop = 110;

  const billTo = vendorInfo?.vendorName || "";

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", marginLeft, billToTop);

  doc.setFont("helvetica", "normal");
  doc.text(billTo, marginLeft, billToTop + 16);
  doc.text("", marginLeft, billToTop + 32);

  const patient = rows?.[0]?.userName || "-";
  const cityName = cityInfo?.cityName || "-";

  const patientTop = billToTop + 60;

  doc.setFont("helvetica", "bold");
  doc.text(`Patient Name: ${patient}`, marginLeft, patientTop);
  doc.text(`City: ${cityName}`, marginLeft, patientTop + 18);

  // Line Separator
  doc.setDrawColor(200);
  doc.setLineWidth(1);
  doc.line(
    marginLeft,
    patientTop + 32,
    pageWidth - marginLeft,
    patientTop + 32
  );

  // -------------------------
  // FORMAT HELPERS
  // -------------------------
  const fmtDate = (v: string) => {
    if (!v) return "-";
    return new Date(v).toLocaleDateString("en-US");
  };

  const fmtTime = (v: string) => {
    if (!v) return "-";
    return new Date(v)
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  // -------------------------
  // MAIN TABLE (redesigned)
  // -------------------------
  const mainHead = [
    [
      "S.No",
      "Pickup Location",
      "Drop Location",
      "Start Date",
      "Start Time",
      "End Date",
      "End Time",
      "Amount",
    ],
  ];

  const mainBody = rows.map((r: any, i: number) => [
    i + 1,
    r.pickupLocation?.locationName || "-",
    r.dropLocation?.locationName || "-",
    fmtDate(r.rideStartTime),
    fmtTime(r.rideStartTime),
    fmtDate(r.rideEndTime),
    fmtTime(r.rideEndTime),
    r.cost != null ? `$${Number(r.cost).toFixed(2)}` : "$0.00",
  ]);

  const mainStartY = patientTop + 55;

  autoTable(doc, {
    startY: mainStartY,
    head: mainHead,
    body: mainBody,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      halign: "center",
      valign: "middle",
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [70, 95, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 246, 255],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 100, halign: "left" },
      2: { cellWidth: 100, halign: "left" },
      3: { cellWidth: 55 },
      4: { cellWidth: 55 },
      5: { cellWidth: 55 },
      6: { cellWidth: 55 },
      7: { cellWidth: 65, halign: "right" },
    },
  });

  // -------------------------
  // TOTAL AMOUNT BOX
  // -------------------------
  const total = rows.reduce((sum: number, r: any) => sum + (r.cost || 0), 0);
  const lastY = (doc as any).lastAutoTable.finalY;

  const boxX = pageWidth - marginLeft - 160;
  const boxY = lastY + 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.rect(boxX, boxY, 160, 28);

  doc.text("TOTAL AMOUNT", boxX + 10, boxY + 18);
  doc.text(`$${total.toFixed(2)}`, boxX + 150, boxY + 18, { align: "right" });

  // -------------------------
  // CITY NAME ABOVE SUMMARY TABLE
  // -------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(cityName, marginLeft, boxY + 80);

  // -------------------------
  // SUMMARY TABLE
  // -------------------------
  const summaryHead = [["S.No", "Pickup Location", "Drop Location", "Price"]];

  const summaryBody = rows.map((r: any, i: number) => [
    i + 1,
    r.pickupLocation?.locationName || "-",
    r.dropLocation?.locationName || "-",
    r.cost != null ? `$${Number(r.cost).toFixed(2)}` : "$0.00",
  ]);

  autoTable(doc, {
    startY: boxY + 95,
    head: summaryHead,
    body: summaryBody,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      halign: "center",
      valign: "middle",
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [70, 95, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 246, 255],
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 150, halign: "left" },
      2: { cellWidth: 150, halign: "left" },
      3: { cellWidth: 80, halign: "right" },
    },
  });

  // -------------------------
  // FOOTER
  // -------------------------
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#888");
  doc.text(
    "Thank you for choosing TTMS. For queries, contact support@ttms.com",
    marginLeft,
    pageHeight - 40
  );

  // SAVE
  doc.save(`${fileName}.pdf`);
};
