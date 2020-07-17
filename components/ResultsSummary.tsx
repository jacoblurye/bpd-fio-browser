import React from "react";
import dynamic from "next/dynamic";
import { Grid, Typography, Box } from "@material-ui/core";
import { Dictionary, sum, mapValues } from "lodash";
import StatsGroup from "./StatsGroup";
import { useRecoilValueLoadable } from "recoil";
import { searchSummary } from "state";
import SimpleCard from "./SimpleCard";

const ZipcodeMap = dynamic(() => import("components/ZipcodeMap"), {
  ssr: false,
});

const ResultsSummary: React.FC = () => {
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

  const friskedPercent = getPercents(summary.totalByFrisked, summary.total);
  const basisPercents = getPercents(summary.totalByBasis, summary.total);
  const racePercents = getPercents(summary.totalByRace, totalPeople);
  const genderPercents = getPercents(summary.totalByGender, totalPeople);

  return (
    <SimpleCard variant="outlined">
      <Typography variant="subtitle1" color="textSecondary">
        Summary
      </Typography>
      <Box marginY={1}>
        <Grid container justify="space-between" spacing={1}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <SimpleCard variant="outlined">
                  <Typography variant="body2">
                    Found{" "}
                    <strong>
                      {summary.total} FIO
                      {summary.total !== 1 ? "s" : ""}
                    </strong>{" "}
                    for the provided filters.
                  </Typography>
                </SimpleCard>
              </Grid>
              <Grid item>
                <StatsGroup
                  title="involved frisk search"
                  data={friskedPercent}
                  filterKey="fcInvolvedFriskOrSearch"
                />
              </Grid>
              <Grid item>
                <StatsGroup
                  title="basis"
                  data={basisPercents}
                  filterKey="basis"
                />
              </Grid>
              <Grid item>
                <StatsGroup title="race" data={racePercents} />
              </Grid>
              <Grid item>
                <StatsGroup title="gender" data={genderPercents} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container justify="center">
              <Grid item>
                <SimpleCard variant="outlined">
                  <Typography variant="overline">
                    Distribution by Zipcode
                  </Typography>
                  <Box height={400} width={[350, 450, 450, 450]}>
                    <ZipcodeMap zipCounts={summary.totalByZip} />
                  </Box>
                  <Typography variant="caption">
                    Select a map area to add a location filter
                  </Typography>
                </SimpleCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </SimpleCard>
  );
};

export default ResultsSummary;
