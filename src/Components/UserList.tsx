import React from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import Card from "./card";
import { Person } from "@mui/icons-material";
import { useGetUsers } from "../Hooks/user";
// import { useUserQuery } from "../Hooks/login";
// import { capitalizeFirstLetter } from "../Config/utility";

const UserList = () => {
  // 🔒 Commented out API
  const { data: users } = useGetUsers();

  const activeCount = users?.length || 0;

  return (
    <Card title="User Management" icon={<Person />}>
      {/* Counts */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Chip
          label={`Active: ${activeCount}`}
          size="small"
          sx={{
            bgcolor: "var(--success)",
            color: "var(--white)",
            fontWeight: 500,
          }}
        />
        <Chip
          label={`Inactive: 0`}
          size="small"
          sx={{
            bgcolor: "var(--error)",
            color: "var(--white)",
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Scrollable User List */}
      <Box
        sx={{
          maxHeight: 200,
          overflow: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {users?.map((user) => (
          <Box
            key={user.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              p: 1,
              borderRadius: 1.5,
              bgcolor: "var(--secondary)",
              border: "1px solid var(--border-light)",
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: 12,
                bgcolor: "var(--primary)",
                color: "var(--white)",
              }}
            >
              {user.username?.[0]?.toUpperCase() || "U"}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  color: "var(--text-primary)",
                  textTransform: "capitalize",
                }}
              >
                {user.username.replace("_", " ")}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-secondary)", fontSize: 11 }}
              >
                {user.email}
              </Typography>
            </Box>

            <Chip
              label={"Active"}
              size="small"
              sx={{
                fontSize: 10,
                height: 20,
                bgcolor: "var(--success)",
                color: "var(--white)",
                textTransform: "capitalize",
              }}
            />
          </Box>
        ))}

        {users?.length === 0 && (
          <Typography
            variant="body2"
            sx={{ color: "var(--text-secondary)", textAlign: "center", mt: 2 }}
          >
            No users found
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default UserList;
