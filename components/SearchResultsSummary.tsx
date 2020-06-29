import React from "react";
import dynamic from "next/dynamic";
import { FCSearchResultSummary } from "interfaces";
import { Grid, Typography, Box } from "@material-ui/core";
import { map, Dictionary, sum } from "lodash";

const ZipcodeMap = dynamic(() => import("components/ZipcodeMap"), {
  ssr: false,
});

export interface SearchResultsSummaryProps {
  summary: FCSearchResultSummary;
  searchTerm: string;
}

const SearchResultsSummary: React.FC<SearchResultsSummaryProps> = ({
  summary,
  searchTerm,
}) => {
  if (summary.total === 0) {
    return null;
  }

  const getPercent = (n: number, total: number) => {
    const percent = Math.round((n / total) * 100);
    return percent < 1 ? `<1%` : `${percent}%`;
  };
  const getTextualHistogram = (hist: Dictionary<number>, total: number) =>
    map(hist, (count, key) => `${getPercent(count, total)} ${key}.`).join(" ");

  const totalPeople = sum(Object.values(summary.totalByRace));

  const friskPercent = getPercent(summary.totalWithFrisk, summary.total);
  const basisPercents = getTextualHistogram(
    summary.totalByBasis,
    summary.total
  );
  const racePercents = getTextualHistogram(summary.totalByRace, totalPeople);
  const genderPercents = getTextualHistogram(
    summary.totalByGender,
    totalPeople
  );

  return (
    <Box m={1}>
      <Grid container justify="space-between">
        <Grid item xs={12} sm={12} md={6}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography>
                Found {summary.total} field contact
                {summary.total !== 1 ? "s" : ""} with "{searchTerm}" in the
                description.
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{friskPercent} involved a frisk search.</Typography>
            </Grid>
            <Grid item>
              <Typography>{basisPercents}</Typography>
            </Grid>
            <Grid item>
              <Typography>{racePercents}</Typography>
            </Grid>
            <Grid item>
              <Typography>{genderPercents}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container justify="center">
            <Grid item>
              <Box height={400} width={[450]}>
                <ZipcodeMap zipCounts={summary.totalByZip} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchResultsSummary;
