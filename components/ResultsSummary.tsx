import React from "react";
import dynamic from "next/dynamic";
import { Grid, Typography, Box, Divider, Hidden } from "@material-ui/core";
import { Dictionary, sum, mapValues } from "lodash";
import StatsGroup from "./StatsGroup";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { searchSummary, searchFilter } from "state";

const ZipcodeMap = dynamic(() => import("components/ZipcodeMap"), {
  ssr: false,
});

const ResultsSummary: React.FC = () => {
  const searchTerm = useRecoilValue(searchFilter("narrative"));
  const summaryLoadable = useRecoilValueLoadable(searchSummary);

  if (summaryLoadable.state !== "hasValue") {
    return null;
  }

  const summary = summaryLoadable.contents;

  if (!summary || summary.total === 0) {
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
    <Box>
      <Typography variant="overline">Summary</Typography>
      <Divider />
      <Box marginY={1}>
        <Grid container justify="space-between" spacing={1}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography>
                  Found {summary.total} field contact
                  {summary.total !== 1 ? "s" : ""} for the provided filters.
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
    </Box>
  );
};

export default ResultsSummary;
