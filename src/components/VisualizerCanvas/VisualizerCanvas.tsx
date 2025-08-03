import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import type { FC } from "react";
interface VisualizerCanvasProps {
  data: number[];
  currentIndex: number;
  compareIndex: number;
}

export const VisualizerCanvas: FC<VisualizerCanvasProps> = ({
  data,
  currentIndex,
  compareIndex,
}) => {
  const theme = useTheme();
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
    // Consider elements to the right of the highest index as sorted
    if (index > Math.max(currentIndex, compareIndex)) return barColors.sorted;
    return barColors.default;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "background.default",
        borderRadius: 1,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="body1" fontWeight="medium">
          Current Size: {data.length} elements
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comparing indices: {currentIndex !== -1 ? currentIndex : "-"} and{" "}
          {compareIndex !== -1 ? compareIndex : "-"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          flex: 1,
          gap: "4px",
          p: 4,
          bgcolor: "background.paper",
          position: "relative",
          height: "calc(100% - 60px)", // Subtract header height
          minHeight: "300px",
        }}
      >
        {data.map((value, index) => (
          <Box
            key={index}
            sx={{
              width: `${Math.max(20, 100 / data.length)}px`,
              height: `${(value / maxValue) * 70}%`,
              bgcolor: getBarColor(index),
              transition: theme.transitions.create(
                ["height", "background-color", "transform"],
                {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeInOut,
                }
              ),
              borderRadius: "4px 4px 0 0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              minHeight: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "relative",
              transform:
                index === currentIndex || index === compareIndex
                  ? "translateY(-8px)"
                  : "translateY(0)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                transform: "translateY(-4px)",
              },
            }}
          >
            {data.length <= 20 && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -20,
                  color: "text.secondary",
                  fontSize: "0.7rem",
                }}
              >
                {value}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
