import { Box, Typography } from "@mui/material";
import Card from "./card";
import { Settings, Business, People, Description } from "@mui/icons-material";
// import { useDasboardTotalProcessQuery } from "../Hooks/dashboardCardTotal";

const OverviewCards = () => {
  // 🔒 Commented out actual API
  // const { data: totalData } = useDasboardTotalProcessQuery();

  // 💡 Dummy data for preview / fallback
  const totalData = {
    data: {
      processesCount: 12,
      verticalsCount: 8,
      AllusersCount: 150,
      annexuresCount: 20,
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* 🟦 Total Process */}
      <Box
        sx={{
          background: "var(--secondary)",
          borderRadius: "8px",
          padding: "1px",
          border: "1px solid var(--border-light)",
        }}
      >
        <Card
          title="Total Process"
          icon={<Settings sx={{ color: "var(--primary)" }} />}
          titleStyle={{
            fontSize: "0.875rem",
            color: "var(--primary)",
            fontWeight: 600,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "var(--primary)",
            }}
          >
            {totalData?.data?.processesCount ?? 0}
          </Typography>
        </Card>
      </Box>

      {/* 🟩 Total Vertical */}
      <Box
        sx={{
          background: "var(--success-light)",
          borderRadius: "8px",
          padding: "1px",
          border: "1px solid var(--border-light)",
        }}
      >
        <Card
          title="Total Vertical"
          icon={<Business sx={{ color: "var(--success)" }} />}
          titleStyle={{
            fontSize: "0.875rem",
            color: "var(--success)",
            fontWeight: 600,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "var(--success)",
            }}
          >
            {totalData?.data?.verticalsCount ?? 0}
          </Typography>
        </Card>
      </Box>

      {/* 🟥 Total Users */}
      <Box
        sx={{
          background: "var(--error-light)",
          borderRadius: "8px",
          padding: "1px",
          border: "1px solid var(--border-light)",
        }}
      >
        <Card
          title="Total Users"
          icon={<People sx={{ color: "var(--error)" }} />}
          titleStyle={{
            fontSize: "0.875rem",
            color: "var(--error)",
            fontWeight: 600,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "var(--error)",
            }}
          >
            {totalData?.data?.AllusersCount ?? 0}
          </Typography>
        </Card>
      </Box>

      {/* 🟨 Total Annexure */}
      <Box
        sx={{
          background: "var(--backgroundInner)",
          borderRadius: "8px",
          padding: "1px",
          border: "1px solid var(--border-light)",
        }}
      >
        <Card
          title="Total Annexure"
          icon={<Description sx={{ color: "var(--text-primary)" }} />}
          titleStyle={{
            fontSize: "0.875rem",
            color: "var(--text-primary)",
            fontWeight: 600,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            {totalData?.data?.annexuresCount ?? 0}
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default OverviewCards;
