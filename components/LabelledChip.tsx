import React from "react";
import { ChipProps, Chip, Grid, Typography } from "@material-ui/core";

interface LabelledChipProps extends ChipProps {
  label?: string;
  value: string;
  statistic?: boolean;
}

const LabelledChip: React.FC<LabelledChipProps> = ({
  label,
  value,
  statistic,
  ...props
}) => {
  const chipProps: ChipProps = { size: "small", variant: "outlined", ...props };

  return (
    <Chip
      label={
        <Grid container spacing={1} alignItems="baseline" wrap="nowrap">
          {label && (
            <Grid item>
              <Typography variant="overline">{label}</Typography>
            </Grid>
          )}
          <Grid item>
            <Typography variant="body2">
              {statistic ? <strong>{value}</strong> : value}
            </Typography>
          </Grid>
        </Grid>
      }
      {...chipProps}
    />
  );
};

export default LabelledChip;
