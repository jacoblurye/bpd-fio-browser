import React from "react";
import { Paper, Box, PaperProps } from "@material-ui/core";

const SimpleCard: React.FC<PaperProps> = ({ children, ...props }) => {
  return (
    <Paper {...props}>
      <Box height="100%" padding={1}>
        {children}
      </Box>
    </Paper>
  );
};

export default SimpleCard;
