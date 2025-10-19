import React, { useState, type ReactNode } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  icon?: ReactNode;
  glow?: boolean;
  children: ReactNode;
  value?: string | number;
  bgColor?: string;
  titleStyle?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  glow,
  children,
  bgColor,
  titleStyle,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    hover: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <Paper
      component={motion.div}
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: 3,
        borderRadius: 3,
        bgcolor: bgColor || "var(--backgroundInner)",
        color: "var(--text-primary)",
        border: `1px solid var(--border-light)`,
        height: "100%",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow */}
      {glow && (
        <Box
          component={motion.div}
          variants={circleVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          sx={{
            position: "absolute",
            top: "-100%",
            right: "-100%",
            width: "300%",
            height: "300%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at top right, var(--primary) 0%, transparent 60%)",
            pointerEvents: "none",
            zIndex: 1,
            transformOrigin: "top right",
          }}
        />
      )}

      {/* Icon */}
      {icon && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 3,
            opacity: 0.7,
            transition: "opacity 0.3s ease",
            "&:hover": { opacity: 1 },
            "& svg": { fontSize: "2rem", color: "var(--primary)" },
          }}
        >
          {icon}
        </Box>
      )}

      {/* Header and content */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            ...titleStyle,
            color: isHovered ? "var(--primary)" : "var(--text-primary)",
          }}
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Paper>
  );
};

export default Card;
