import React from "react";
import { Chip, Typography, Grid, ChipProps } from "@material-ui/core";
import { useSearchFilters } from "state";
import { SearchField } from "interfaces";

interface FilterChipProps extends Omit<ChipProps, "onDelete"> {
  filterKey: SearchField["field"];
  value: string;
  label?: string;
  deletable?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  filterKey,
  label,
  value,
  clickable,
  deletable,
  ...props
}) => {
  const chipLabel = label || filterKey;
  const filters = useSearchFilters();
  const filter = { field: filterKey, query: value };

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
      onClick={clickable ? () => filters.add(filter) : undefined}
      onDelete={deletable ? () => filters.remove(filter) : undefined}
      {...props}
    />
  );
};

export default FilterChip;
