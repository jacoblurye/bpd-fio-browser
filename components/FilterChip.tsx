import React from "react";
import { Chip, Typography, Grid, ChipProps } from "@material-ui/core";

interface FilterChipProps extends ChipProps {
  filterKey: string;
  label?: string;
  value: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  filterKey,
  label,
  value,
  ...props
}) => {
  const chipLabel = label || filterKey;
  return (
    <Chip
      size="small"
      label={
        <Grid container spacing={1} alignItems="baseline" wrap="nowrap">
          <Grid item>
            <Typography color="textSecondary" variant="overline">
              {chipLabel}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">{value}</Typography>
          </Grid>
        </Grid>
      }
      {...props}
    />
  );
};

export default FilterChip;
