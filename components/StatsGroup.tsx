import React from "react";
import { Dictionary, map } from "lodash";
import { Grid, Typography, makeStyles, Chip } from "@material-ui/core";
import theme from "style/theme";

const useStyles = makeStyles({
  statValue: {
    fontWeight: theme.typography.fontWeightBold,
  },
});

export interface StatsGroupProps {
  title: string;
  data: Dictionary<number | string>;
}

const StatsItem: React.FC<{
  label: string;
  value: number | string;
}> = ({ label, value }) => {
  const classes = useStyles();

  return (
    <Chip
      size="small"
      label={
        <Grid container wrap="nowrap" spacing={1} alignItems="center">
          <Grid item>
            <Typography align="center" variant="overline">
              {label}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.statValue} variant="body2">
              {value}
            </Typography>
          </Grid>
        </Grid>
      }
    />
  );
};

const StatsGroup: React.FC<StatsGroupProps> = ({ title, data }) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="overline">{title}</Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          {map(data, (value, label) => (
            <Grid item key={label}>
              <StatsItem label={label} value={value} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StatsGroup;
