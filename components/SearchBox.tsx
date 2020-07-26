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
import { map } from "lodash";
import SimpleCard from "./SimpleCard";

const SEARCH_BOX = "search-box";

const FIELD_MAP: Record<SearchField["field"], string> = {
  narrative: "report contains",
  contactOfficerName: "officer",
  zip: "area",
  basis: "basis",
  year: "year",
  fcInvolvedFriskOrSearch: "frisk search",
  includedGenders: "gender",
  includedRaces: "race",
  includedEthnicities: "ethnicity",
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
      <SimpleCard variant="outlined">
        <form onSubmit={handleSearch}>
          <Box position="relative">
            <TextField
              autoFocus
              name={SEARCH_BOX}
              ref={searchBoxRef}
              inputRef={formInstance.register}
              fullWidth
              onChange={() => {
                setShowSuggestions(true);
              }}
              variant="outlined"
              placeholder="Add report filters"
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
            {showSuggestions && (
              <Box
                width="100%"
                marginTop={1}
                position="absolute"
                zIndex={999999}
              >
                <Suggestions />
              </Box>
            )}
            {filters.filters.length > 0 && (
              <Box marginTop={1}>
                <SimpleCard variant="outlined">
                  <Box marginBottom={1}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Filters
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Tooltip title="clear all filters">
                          <IconButton
                            size="small"
                            onClick={() => filters.setAll([])}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
                  <Grid container spacing={1}>
                    {filters.filters.map(({ field, query }) => (
                      <Grid item key={`${field}${query}`}>
                        <FilterChip
                          filterKey={field}
                          label={FIELD_MAP[field]}
                          value={query}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </SimpleCard>
              </Box>
            )}
          </Box>
        </form>
      </SimpleCard>
    </FormContext>
  );
};

const Suggestions: React.FC = () => {
  const { watch } = useFormContext();
  const searchValue = watch(SEARCH_BOX);
  const suggestions = getSuggestions(searchValue);

  if (!searchValue) {
    return null;
  }

  return (
    <Paper elevation={6}>
      <Box padding={1}>
        <FilterChip
          clickable
          filterKey={"narrative"}
          label={FIELD_MAP.narrative}
          value={searchValue}
        />
      </Box>
      {map(suggestions, (values, key: SearchField["field"]) => {
        return (
          values.length > 0 && (
            <React.Fragment key={key}>
              <Box padding={1}>
                <Divider />
              </Box>
              <Box padding={1}>
                <Grid container spacing={1}>
                  {values.map((value) => (
                    <Grid item key={value}>
                      <FilterChip
                        clickable
                        filterKey={key}
                        label={FIELD_MAP[key]}
                        value={value}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </React.Fragment>
          )
        );
      })}
    </Paper>
  );
};

export default SearchBox;
