import React from "react";
import { useSearchFilters } from "state";
import {
  IconButton,
  TextField,
  Box,
  Paper,
  Grid,
  Divider,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { Search, Close } from "@material-ui/icons";
import { useForm, FormContext, useFormContext } from "react-hook-form";
import FilterChip from "./FilterChip";
import getSuggestions from "utils/get-suggestions";
import { SearchField } from "interfaces";

const SEARCH_BOX = "search-box";

const FIELD_MAP: Record<SearchField["field"], string> = {
  narrative: "report contains",
  contactOfficerName: "officer",
  zip: "area",
};

const SearchBox: React.FC = () => {
  const searchBoxRef = React.useRef<HTMLDivElement>(null);

  const formInstance = useForm();
  const filters = useSearchFilters();
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
  React.useEffect(() => {
    formInstance.reset();
    setShowSuggestions(false);
  }, [filters.filters]);

  // On submit, assume the searchbox contents are a filter on report narrative contents
  const handleSearch = formInstance.handleSubmit(({ [SEARCH_BOX]: q }) => {
    filters.add({ field: "narrative", query: q });
    formInstance.reset();
    // Clear searchbox focus
    // @ts-ignore
    document.activeElement?.blur();
  });

  return (
    <FormContext {...formInstance}>
      <form onSubmit={handleSearch}>
        <Box position="relative">
          <Box>
            <TextField
              name={SEARCH_BOX}
              ref={searchBoxRef}
              inputRef={formInstance.register}
              fullWidth
              autoFocus
              onChange={() => {
                setShowSuggestions(true);
              }}
              variant="outlined"
              placeholder={
                filters.filters.length > 0
                  ? "Add another filter"
                  : "Search 35,000 police records"
              }
              InputProps={{
                endAdornment: (
                  <IconButton
                    style={{ background: "none" }}
                    onClick={handleSearch}
                  >
                    <Search />
                  </IconButton>
                ),
              }}
              autoComplete="off"
              autoCorrect="off"
            />
          </Box>
          {showSuggestions && (
            <Box width="100%" marginTop={1} position="absolute" zIndex={999999}>
              <Suggestions />
            </Box>
          )}
          {filters.filters.length > 0 && (
            <Box marginTop={1}>
              <Paper variant="outlined">
                <Box padding={1}>
                  <Box marginBottom={1}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="overline">Filters</Typography>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Clear all filters">
                          <IconButton
                            size="small"
                            onClick={() => filters.setAll([])}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Divider />
                  </Box>
                  <Grid container spacing={1}>
                    {filters.filters.map(({ field, query }) => (
                      <Grid item key={`${field}${query}`}>
                        <FilterChip
                          deletable
                          filterKey={field}
                          label={FIELD_MAP[field]}
                          value={query}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </form>
    </FormContext>
  );
};

const Suggestions: React.FC = () => {
  const { watch } = useFormContext();
  const searchValue = watch(SEARCH_BOX);
  const { contactOfficerName } = getSuggestions(searchValue);

  if (!searchValue) {
    return null;
  }

  return (
    <Paper elevation={3}>
      <Box padding={1}>
        <FilterChip
          clickable
          filterKey={"narrative"}
          label={"Report contains"}
          value={searchValue}
        />
      </Box>
      {contactOfficerName.length > 0 && (
        <>
          <Box padding={1}>
            <Divider />
          </Box>
          <Box padding={1}>
            <Grid container spacing={1}>
              {contactOfficerName.map((officer) => (
                <Grid item key={officer}>
                  <FilterChip
                    clickable
                    filterKey={"contactOfficerName"}
                    label={"officer"}
                    value={officer}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SearchBox;
