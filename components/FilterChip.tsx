import React from "react";
import { Chip, Typography, Grid, ChipProps } from "@material-ui/core";
import { searchFilter } from "state";
import { SearchField } from "interfaces";
import { useSetRecoilState } from "recoil";
import { Add } from "@material-ui/icons";

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
  const setFilter = useSetRecoilState(searchFilter(filterKey));

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
      deleteIcon={clickable ? <Add /> : undefined}
      onClick={clickable ? () => setFilter(value) : undefined}
      onDelete={deletable ? () => setFilter(undefined) : undefined}
      {...props}
    />
  );
};

export default FilterChip;
