import React from "react";
import { Chip, Typography, Grid, ChipProps, Tooltip } from "@material-ui/core";
import { useSearchFilters } from "state";
import { SearchField } from "interfaces";
import { getFilterValueDisplay } from "utils/filter-helpers";
import { RemoveCircle, AddCircle } from "@material-ui/icons";

interface FilterChipProps extends Omit<ChipProps, "onDelete"> {
  filterKey: SearchField["field"];
  value: string;
  label?: string;
  statistic?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  filterKey,
  label,
  value,
  statistic,
  ...props
}) => {
  const filters = useSearchFilters();
  const filter: SearchField = {
    field: filterKey,
    query: statistic && label ? label : value,
  };
  const isSelected = filters.has(filter);

  const displayLabel = label
    ? statistic
      ? getFilterValueDisplay(filterKey, label)
      : label
    : filterKey;
  const displayValue = statistic ? (
    <strong>{value}</strong>
  ) : (
    getFilterValueDisplay(filterKey, value)
  );
  const actionIcon = (
    <Tooltip title={isSelected ? "remove from filters" : "add to filters"}>
      {isSelected ? (
        <RemoveCircle color="action" />
      ) : (
        <AddCircle color="inherit" />
      )}
    </Tooltip>
  );

  return (
    <Chip
      size="small"
      variant={isSelected ? "default" : "outlined"}
      label={
        <Grid container spacing={1} alignItems="baseline" wrap="nowrap">
          <Grid item>
            <Typography variant="overline">{displayLabel}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">{displayValue}</Typography>
          </Grid>
        </Grid>
      }
      onClick={isSelected ? undefined : () => filters.add(filter)}
      onDelete={
        isSelected ? () => filters.remove(filter) : () => filters.add(filter)
      }
      deleteIcon={actionIcon}
      {...props}
    />
  );
};

export default FilterChip;
