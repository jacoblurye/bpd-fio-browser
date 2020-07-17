import React from "react";
import { Dictionary, map } from "lodash";
import { Grid, Typography } from "@material-ui/core";
import { SearchField } from "interfaces";
import FilterChip from "./FilterChip";
import LabelledChip from "./LabelledChip";
import SimpleCard from "./SimpleCard";

export interface StatsGroupProps {
  title: string;
  data: Dictionary<number | string>;
  filterKey?: SearchField["field"];
}

const StatsGroup: React.FC<StatsGroupProps> = ({ title, data, filterKey }) => {
  return (
    <SimpleCard variant="outlined">
      <Grid container direction="column">
        <Grid item>
          <Typography variant="overline">{title}</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            {map(data, (value, label) => (
              <Grid item key={label}>
                {filterKey ? (
                  <FilterChip
                    statistic
                    label={label}
                    value={value.toString()}
                    filterKey={filterKey}
                  />
                ) : (
                  <LabelledChip
                    statistic
                    label={label}
                    value={value.toString()}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </SimpleCard>
  );
};

export default StatsGroup;
