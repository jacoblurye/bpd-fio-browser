import React from "react";
import { FieldContact } from "interfaces";
import { Grid, Fade } from "@material-ui/core";
import ReportSummaryCard from "./ReportSummaryCard";

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
          <Fade in={true} timeout={300}>
            <ReportSummaryCard report={report} searchTerm={searchTerm} />
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResultsList;
