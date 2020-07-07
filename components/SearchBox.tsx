import React from "react";
import { searchFilter, searchFilters } from "state";
import { IconButton, TextField, Box, Paper, Grid } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useForm, FormContext, useFormContext } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { useRecoilState, useRecoilValue } from "recoil";
import FilterChip from "./FilterChip";
import { isEmpty } from "lodash";
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

  const router = useRouter();
  const formInstance = useForm();
  const [query, setQuery] = useRecoilState(searchFilter("narrative"));
  const filters = useRecoilValue(searchFilters);
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
  React.useEffect(() => {
    formInstance.reset();
    setShowSuggestions(false);
  }, [filters]);

  React.useEffect(() => {
    // Sync the searchbox value with the `q` query param
    const q = router.query.q as string;
    if (q && q !== query) {
      formInstance.setValue(SEARCH_BOX, q);
      handleSearch();
    }
  }, [router]);

  // Execute a search query based on the search box contents
  const handleSearch = formInstance.handleSubmit(({ [SEARCH_BOX]: q }) => {
    setQuery(q);
    formInstance.reset();
    const query = isEmpty(q) ? undefined : { q };
    router.push({ pathname: router.pathname, query });
    // Clear searchbox focus
    // @ts-ignore
    document.activeElement?.blur();
  });

  console.log(showSuggestions);

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
              // onBlur={() => {
              //   setShowSuggestions(false);
              // }}
              variant="outlined"
              placeholder="Search 35,000 police records"
              InputProps={{
                startAdornment: filters && (
                  <>
                    {filters.map(({ field, query }) => (
                      <Box key={`${field}${query}`} marginRight={1}>
                        <FilterChip
                          deletable
                          filterKey={field}
                          label={FIELD_MAP[field]}
                          value={query}
                        />
                      </Box>
                    ))}
                  </>
                ),
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
        </Box>
      </form>
    </FormContext>
  );
};

const Suggestions: React.FC = () => {
  const { watch } = useFormContext();
  const searchValue = watch(SEARCH_BOX);
  const { contactOfficerName } = getSuggestions(searchValue);

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
    </Paper>
  );
};

export default SearchBox;
