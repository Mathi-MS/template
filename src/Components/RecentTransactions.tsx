import React from "react";
import { Box, Typography } from "@mui/material";
import CustomTable from "../Custom/CustomTable";
import Card from "./card";
// import { useRecentTransactionQuery } from "../Hooks/dashboard";

interface RecentTransactionsProps {
  vertical?: string;
  processId?: string;
}

interface RowData {
  [key: string]: any;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  vertical,
  processId,
}) => {
  // 🔒 Commented out the real API call
  // const { data } = useRecentTransactionQuery(vertical, processId);

  // 💡 Dummy fallback data
  const data = [
    {
      Transaction_ID: "TXN-001",
      "Total Errors Identified": 3,
      "Total Observations": 7,
      "Total Amount": 1250,
    },
    {
      Transaction_ID: "TXN-002",
      "Total Errors Identified": 0,
      "Total Observations": 2,
      "Total Amount": 980,
    },
    {
      Transaction_ID: "TXN-003",
      "Total Errors Identified": 1,
      "Total Observations": 5,
      "Total Amount": 640,
    },
  ];

  const tableRows = (data || [])?.map((transaction: any, index: number) => ({
    slno: index + 1,
    ...transaction,
  }));

  const columns =
    data?.length > 0
      ? [
          { id: "slno", label: "Sl No" },
          ...Object.keys(data[0])
            .filter((key) => key !== "processId")
            .map((key) => {
              const label = key.replace(/_/g, " ");

              if (label === "Total Errors Identified") {
                return {
                  id: key,
                  label,
                  render: (row: RowData) => (
                    <span style={{ color: "var(--error)", fontWeight: 600 }}>
                      {row[key]}
                    </span>
                  ),
                };
              }

              if (label === "Total Observations") {
                return {
                  id: key,
                  label,
                  render: (row: RowData) => (
                    <span
                      style={{ color: "var(--primary-dark)", fontWeight: 600 }}
                    >
                      {row[key]}
                    </span>
                  ),
                };
              }

              if (label === "Total Amount") {
                return {
                  id: key,
                  label,
                  render: (row: RowData) => (
                    <span style={{ color: "var(--success)", fontWeight: 600 }}>
                      {row[key]}
                    </span>
                  ),
                };
              }

              return { id: key, label };
            }),
        ]
      : [];

  return (
    <Card title="Recent Transactions">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography
          variant="subtitle2"
          sx={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          Latest transaction insights
        </Typography>
      </Box>

      <CustomTable
        search
        columns={columns}
        rows={tableRows}
        noDataMessage="No transactions available"
      />
    </Card>
  );
};

export default RecentTransactions;
