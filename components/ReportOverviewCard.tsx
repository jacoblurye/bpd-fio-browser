import React from "react";
import { FieldContact } from "interfaces";
import {
  Typography,
  Grid,
  Chip,
  ChipProps,
  makeStyles,
  Box,
  Paper,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import zipToNeighborhood from "json/zip-to-neighborhood.json";
import theme from "style/theme";
import { Dictionary } from "lodash";
// import moment from "moment-timezone";

const useStyles = makeStyles({
  inlineText: {
    display: "inline",
  },
  inlineSearchText: {
    display: "inline",
    background: theme.palette.success.light,
    borderRadius: 5,
    padding: 3,
  },
});

interface LabelledChipProps extends ChipProps {
  label?: string;
  value: string;
}

const LabelledChip: React.FC<LabelledChipProps> = ({
  label,
  value,
  ...props
}) => {
  return (
    <Chip
      size="small"
      label={
        <Grid container spacing={1} alignItems="baseline" wrap="nowrap">
          {label && (
            <Grid item>
              <Typography color="textSecondary" variant="overline">
                {label}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <Typography variant="body2">{value}</Typography>
          </Grid>
        </Grid>
      }
      {...props}
    />
  );
};

const friskMapping = {
  y: "yes",
  n: "no",
};

export interface ReportOverviewCardProps {
  report: FieldContact;
}

const ReportOverviewCard: React.FC<ReportOverviewCardProps> = ({ report }) => {
  const classes = useStyles();

  const searchTerm = undefined;
  const lowerCaseSearchTerm = undefined;
  const narrativeChunks = report.narrative
    ? searchTerm
      ? report.narrative.split(` ${lowerCaseSearchTerm} `)
      : [report.narrative]
    : [];
  const lastChunk = narrativeChunks.length - 1;

  const officerName = report.contactOfficerName;

  const basis = report.basis;

  const friskSearch =
    friskMapping[report.fcInvolvedFriskOrSearch] ||
    report.fcInvolvedFriskOrSearch;

  const area = report.zip
    ? (zipToNeighborhood as Dictionary<string>)[report.zip] || "Boston"
    : "Boston";
  // const contactTime =
  //   moment(report.contactDate).tz("EST").format("MMM. D YYYY @ hh:mm A") +
  //   " (WRONG)";

  return (
    <Paper variant="outlined">
      <Box padding={1}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <LabelledChip
                  label="officer"
                  value={officerName}
                  onClick={() => alert(report.contactOfficerName)}
                />
              </Grid>
              <Grid item>
                <LabelledChip label="basis" value={basis} />
              </Grid>
              <Grid item>
                <LabelledChip label="frisked" value={friskSearch} />
              </Grid>
              <Grid item>
                <LabelledChip label="area" value={area} />
              </Grid>
              <Grid item xs={12} />
              {report.people.map((person, i) => {
                const profile =
                  person.race === "(not reported)" &&
                  person.gender === "(not reported)"
                    ? "(not reported)"
                    : `${`${person.race} ${person.gender}`} | ${person.age}`;
                return (
                  <Grid key={i} item>
                    <LabelledChip avatar={<Person />} value={profile} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item>
            {narrativeChunks.map((chunk, i) => {
              return (
                <React.Fragment key={i}>
                  <Typography className={classes.inlineText}>
                    {chunk}
                  </Typography>
                  {i !== lastChunk && (
                    <>
                      {" "}
                      <Typography className={classes.inlineSearchText}>
                        {searchTerm}
                      </Typography>{" "}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ReportOverviewCard;
