import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";

interface InfoPanelProps {
  algorithm: string;
  currentStep: number;
  totalSteps: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export const InfoPanel: FC<InfoPanelProps> = ({
  algorithm,
  currentStep,
  totalSteps,
  timeComplexity,
  spaceComplexity,
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Algorithm: {algorithm}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>
          Step: {currentStep} / {totalSteps}
        </Typography>
        <Typography>Time Complexity: {timeComplexity}</Typography>
        <Typography>Space Complexity: {spaceComplexity}</Typography>
      </Box>
    </Paper>
  );
};
