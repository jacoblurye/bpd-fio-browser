import React from "react";
import { FieldContact } from "interfaces";
import { Typography, Grid, makeStyles, fade } from "@material-ui/core";
import { Person } from "@material-ui/icons";
import FilterChip from "components/FilterChip";
import LabelledChip from "./LabelledChip";
import SimpleCard from "./SimpleCard";
import { useSearchFilters } from "state";

const useStyles = makeStyles((theme) => ({
  inlineText: {
    display: "inline",
    wordWrap: "break-word",
  },
  inlineSearchText: {
    display: "inline",
    background: fade(theme.palette.info.light, 0.5),
    borderRadius: 5,
    padding: 2,
    margin: 1,
  },
}));

interface NarrativeText {
  text: string;
}

const NarrativeText: React.FC<NarrativeText> = ({ text }) => {
  const classes = useStyles();
  const { filters } = useSearchFilters();
  const searchTerms = filters
    .filter((f) => f.field === "narrative")
    .map((f) => f.query);

  if (searchTerms.length === 0) {
    return <Typography>{text}</Typography>;
  }

  const matchSearchTerms = new RegExp(
    `[^a-z](${searchTerms.join("|")})[^a-z]`,
    "gi"
  );
  const textChunks = text.split(matchSearchTerms);

  return (
    <Typography>
      {textChunks.map((textChunk, chunkNum) => {
        const isSearchTerm = chunkNum % 2 === 1;
        return (
          <React.Fragment key={chunkNum}>
            <Typography
              className={
                isSearchTerm ? classes.inlineSearchText : classes.inlineText
              }
            >
              {textChunk.trimRight()}
            </Typography>{" "}
          </React.Fragment>
        );
      })}
    </Typography>
  );
};

export interface ReportOverviewCardProps {
  report: FieldContact;
}

const ReportOverviewCard: React.FC<ReportOverviewCardProps> = ({ report }) => {
  return (
    <SimpleCard variant="outlined">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <FilterChip
                label="officer"
                filterKey="contactOfficerName"
                value={report.contactOfficerName}
              />
            </Grid>
            <Grid item>
              <FilterChip
                label="unit supervisor"
                filterKey="supervisorName"
                value={report.supervisorName}
              />
            </Grid>
            <Grid item>
              <FilterChip filterKey="basis" value={report.basis} />
            </Grid>
            <Grid item>
              <FilterChip
                label="frisk search"
                filterKey="fcInvolvedFriskOrSearch"
                value={report.fcInvolvedFriskOrSearch}
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
            <Grid item>
              <FilterChip
                clickable
                label="year"
                filterKey="year"
                value={report.year}
              />
            </Grid>
            <Grid item xs={12} />
            {report.people.map((person, i) => {
              const ethnicity =
                person.ethnicity === "hispanic origin" ? "hispanic " : "";
              const profile =
                person.race === "[not reported]" &&
                person.gender === "[not reported]" &&
                !ethnicity
                  ? "[not reported]"
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
          <NarrativeText text={report.narrative} />
        </Grid>
      </Grid>
    </SimpleCard>
  );
};

export default ReportOverviewCard;
