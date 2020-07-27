import React from "react";
import dynamic from "next/dynamic";
import { Grid, Typography, Box } from "@material-ui/core";
import { Dictionary, sum, mapValues } from "lodash";
import StatsGroup from "./StatsGroup";
import { useRecoilValueLoadable } from "recoil";
import { searchSummary, useSearchFilters } from "state";
import SimpleCard from "./SimpleCard";
import { SearchResultSummary } from "interfaces";

const ZipcodeMap = dynamic(() => import("components/ZipcodeMap"), {
  ssr: false,
});

export interface ResultsSummaryProps {
  initialSummary: SearchResultSummary;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ initialSummary }) => {
  const hasFilters = useSearchFilters().filters.length > 0;
  const summaryLoadable = useRecoilValueLoadable(searchSummary);

  if (hasFilters && summaryLoadable.state !== "hasValue") {
    return null;
  }

  const summary =
    summaryLoadable.state === "hasValue" && summaryLoadable.contents
      ? summaryLoadable.contents
      : initialSummary;

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

  const yearPercents = getPercents(summary.totalByYear, summary.total);
  const friskedPercents = getPercents(summary.totalByFrisked, summary.total);
  const basisPercents = getPercents(summary.totalByBasis, summary.total);
  const racePercents = getPercents(summary.totalByRace, totalPeople);
  const ethnicityPercents = getPercents(summary.totalByEthnicity, totalPeople);
  const genderPercents = getPercents(summary.totalByGender, totalPeople);

  const fioCountText = (
    <strong>
      {summary.total} FIO
      {summary.total !== 1 ? "s" : ""}
    </strong>
  );

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
                    {hasFilters ? (
                      <>Found {fioCountText} for the provided filters.</>
                    ) : (
                      <>Showing results for all {fioCountText}.</>
                    )}
                  </Typography>
                </SimpleCard>
              </Grid>
              <Grid item>
                <StatsGroup title="year" data={yearPercents} filterKey="year" />
              </Grid>
              <Grid item>
                <StatsGroup
                  title="frisk search"
                  data={friskedPercents}
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
                <StatsGroup
                  title="race"
                  data={racePercents}
                  filterKey="includedRaces"
                />
              </Grid>
              <Grid item>
                <StatsGroup
                  title="ethnicity"
                  data={ethnicityPercents}
                  filterKey="includedEthnicities"
                />
              </Grid>
              <Grid item>
                <StatsGroup
                  title="gender"
                  data={genderPercents}
                  filterKey="includedGenders"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ZipcodeMap zipCounts={summary.totalByZip} />
          </Grid>
        </Grid>
      </Box>
    </SimpleCard>
  );
};

export default ResultsSummary;
