import React from "react";
import { FieldContact } from "interfaces";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  ChipProps,
  makeStyles,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import zipToNeighborhood from "data/zip-to-neighborhood.json";
import theme from "style/theme";
// import moment from "moment-timezone";

const UNKNOWN = "(not provided)";

const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

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
  y: "Yes",
  n: "No",
};

export interface ReportOverviewCardProps {
  report: FieldContact;
  searchTerm: string;
}

const ReportOverviewCard: React.FC<ReportOverviewCardProps> = ({
  report,
  searchTerm,
}) => {
  const classes = useStyles();

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const narrativeChunks = report.narrative
    ? report.narrative.split(lowerCaseSearchTerm)
    : [];
  const lastChunk = narrativeChunks.length - 1;

  const officerName = report.contactOfficerName
    ? titleCase(report.contactOfficerName)
    : UNKNOWN;

  const basis = titleCase(report.basis || UNKNOWN);

  const friskSearch = report.fcInvolvedFriskOrSearch
    ? friskMapping[report.fcInvolvedFriskOrSearch]
    : UNKNOWN;

  const area = report.zip
    ? zipToNeighborhood[report.zip] || "Boston"
    : "Boston";
  // const contactTime =
  //   moment(report.contactDate).tz("EST").format("MMM. D YYYY @ hh:mm A") +
  //   " (WRONG)";

  return (
    <Card>
      <CardContent>
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
                const race = person.race || UNKNOWN;
                const gender = person.sex || UNKNOWN;
                const profile =
                  !person.race && !person.sex
                    ? UNKNOWN
                    : titleCase(`${race} ${gender}`);
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
                    <Typography className={classes.inlineSearchText}>
                      {searchTerm}
                    </Typography>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReportOverviewCard;
