import React from "react";
import { FieldContact } from "interfaces";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import { Person } from "@material-ui/icons";
import theme from "style/theme";
import FilterChip from "components/FilterChip";
import LabelledChip from "./LabelledChip";
import SimpleCard from "./SimpleCard";
// import moment from "moment-timezone";

const useStyles = makeStyles({
  inlineText: {
    display: "inline",
    wordWrap: "break-word",
  },
  inlineSearchText: {
    display: "inline",
    background: theme.palette.success.light,
    borderRadius: 5,
    padding: 3,
  },
});

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
  const friskSearch = report.fcInvolvedFriskOrSearch;
  // const contactTime =
  //   moment(report.contactDate).tz("EST").format("MMM. D YYYY @ hh:mm A") +
  //   " (WRONG)";

  return (
    <SimpleCard variant="outlined">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <FilterChip
                label="officer"
                filterKey="contactOfficerName"
                value={officerName}
              />
            </Grid>
            <Grid item>
              <FilterChip filterKey="basis" value={basis} />
            </Grid>
            <Grid item>
              <FilterChip
                label="frisked"
                filterKey="fcInvolvedFriskOrSearch"
                value={friskSearch}
              />
            </Grid>
            <Grid item>
              <FilterChip
                clickable
                label="area"
                filterKey="zip"
                value={report.zip}
              />
            </Grid>
            <Grid item xs={12} />
            {report.people.map((person, i) => {
              console.log(person.ethnicity);
              const ethnicity =
                person.ethnicity === "hispanic origin" ? "hispanic " : "";
              const profile =
                person.race === "(not reported)" &&
                person.gender === "(not reported)" &&
                !ethnicity
                  ? "(not reported)"
                  : `${ethnicity}${person.race} ${person.gender} | ${person.age} y.o.`;
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
                <Typography className={classes.inlineText}>{chunk}</Typography>
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
    </SimpleCard>
  );
};

export default ReportOverviewCard;
