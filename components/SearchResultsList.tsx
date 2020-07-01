import React from "react";
import { FieldContact } from "interfaces";
import { Grid } from "@material-ui/core";
import ReportOverviewCard from "./ReportOverviewCard";

export interface SearchResultsListProps {
  results: FieldContact[];
  searchTerm: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  searchTerm,
}) => {
  return (
    <Grid container direction="column" spacing={1}>
      {results?.map((report) => (
        <Grid item key={report.fcNum}>
          <ReportOverviewCard report={report} searchTerm={searchTerm} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResultsList;
