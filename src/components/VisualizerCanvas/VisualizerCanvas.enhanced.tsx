import { Box, Typography, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { type FC, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

interface VisualizerCanvasProps {
  data: number[];
  currentIndex: number;
  compareIndex: number;
}

const MotionBox = motion(Box);

export const VisualizerCanvas: FC<VisualizerCanvasProps> = ({
  data,
  currentIndex,
  compareIndex,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...data);

  const barColors = useMemo(
    () => ({
      default: theme.palette.primary.light,
      comparing: theme.palette.warning.main,
      active: theme.palette.primary.dark,
      sorted: theme.palette.success.main,
    }),
    [theme]
  );

  const getBarColor = (index: number) => {
    if (index === currentIndex) return barColors.active;
    if (index === compareIndex) return barColors.comparing;
    if (index > Math.max(currentIndex, compareIndex)) return barColors.sorted;
    return barColors.default;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    d3.select(containerRef.current)
      .selectAll(".bar-container")
      .data(data)
      .join("div")
      .attr("class", "bar-container")
      .style("opacity", 1);
  }, [data]);

  const barVariants: Variants = {
    initial: {
      scaleY: 0,
      opacity: 0,
      y: 50,
    },
    animate: {
      scaleY: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      scaleY: 0,
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
    hover: {
      y: -5,
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    comparing: {
      y: -15,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const valueVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "background.default",
        borderRadius: 2,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="body1" fontWeight="medium">
          Size: {data.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comparing: {currentIndex !== -1 ? currentIndex : "-"} ↔{" "}
          {compareIndex !== -1 ? compareIndex : "-"}
        </Typography>
      </Box>
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          flex: 1,
          gap: { xs: "2px", sm: "4px" },
          p: { xs: 2, sm: 4 },
          bgcolor: "background.paper",
          position: "relative",
          height: { xs: "60vh", sm: "70vh" },
          minHeight: "300px",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="sync">
          {data.map((value, index) => (
            <MotionBox
              key={`${index}-${value}`}
              initial="initial"
              animate={
                index === currentIndex || index === compareIndex
                  ? "comparing"
                  : "animate"
              }
              exit="exit"
              whileHover="hover"
              variants={barVariants}
              layout
              sx={{
                width: `${Math.max(8, 60 / data.length)}%`,
                maxWidth: "60px",
                height: `${(value / maxValue) * 85}%`,
                bgcolor: getBarColor(index),
                borderRadius: "4px 4px 0 0",
                boxShadow: theme.shadows[4],
                minHeight: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "relative",
                transformOrigin: "bottom",
                backdropFilter: "blur(8px)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                },
              }}
            >
              {data.length <= 20 && (
                <MotionBox
                  variants={valueVariants}
                  sx={{
                    position: "absolute",
                    top: -24,
                    color: "text.secondary",
                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                    fontWeight: "medium",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {value}
                </MotionBox>
              )}
            </MotionBox>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
};
