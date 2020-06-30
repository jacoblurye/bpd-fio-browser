import React from "react";
import { Dictionary, map } from "lodash";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import theme from "style/theme";

const useStyles = makeStyles({
  statValue: {
    fontWeight: theme.typography.fontWeightBold,
  },
  statLabel: {
    lineHeight: 1,
  },
  statLabelContainer: {
    textAlign: "center",
    overflowWrap: "normal",
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
    <Grid container direction="column" justify="center">
      <Grid item>
        <Typography className={classes.statValue} align="center">
          {value}
        </Typography>
      </Grid>
      <Grid item className={classes.statLabelContainer}>
        <Typography
          className={classes.statLabel}
          align="center"
          variant="overline"
        >
          {label}
        </Typography>
      </Grid>
    </Grid>
  );
};

const StatsGroup: React.FC<StatsGroupProps> = ({ title, data }) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography color="textSecondary" variant="overline">
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container justify="space-evenly" spacing={1}>
          {map(data, (value, label) => (
            <Grid item key={label} xs={6} sm={3}>
              <StatsItem label={label} value={value} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StatsGroup;
