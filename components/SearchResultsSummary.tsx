import React from "react";
import dynamic from "next/dynamic";
import { FCSearchResultSummary } from "interfaces";
import { Grid, Typography, Box, Divider, Hidden } from "@material-ui/core";
import { Dictionary, sum, mapValues } from "lodash";
import StatsGroup from "./StatsGroup";

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
  const getPercents = (dist: Dictionary<number>, total: number) => {
    const sortedLabels = Object.keys(dist).sort(
      (label1, label2) => dist[label2] - dist[label1]
    );

    const sortedDist = sortedLabels.reduce(
      (prev, l) => ({ ...prev, [l]: dist[l] }),
      {}
    );

    return mapValues(sortedDist, (v) => getPercent(v, total));
  };

  const totalPeople = sum(Object.values(summary.totalByRace));

  const friskPercent = getPercent(summary.totalWithFrisk, summary.total);
  const basisPercents = getPercents(summary.totalByBasis, summary.total);
  const racePercents = getPercents(summary.totalByRace, totalPeople);
  const genderPercents = getPercents(summary.totalByGender, totalPeople);

  return (
    <Box marginY={1}>
      <Grid container justify="space-between" spacing={1}>
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
              <StatsGroup title="basis" data={basisPercents} />
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <StatsGroup title="race" data={racePercents} />
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <StatsGroup title="gender" data={genderPercents} />
            </Grid>
            <Hidden mdUp>
              <Grid item>
                <Divider />
              </Grid>
              <Grid item />
            </Hidden>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container justify="center">
            <Grid item>
              <Box height={400} width={[350, 450, 450, 450]}>
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
