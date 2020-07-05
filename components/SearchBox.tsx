import React from "react";
import { searchFilter } from "state";
import { IconButton, TextField, Box, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useForm, FormContext, useFormContext } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import FilterChip from "./FilterChip";
import { isEmpty } from "lodash";

const SEARCH_BOX = "search-box";

const SearchBox: React.FC = () => {
  const router = useRouter();
  const formInstance = useForm();
  const [query, setQuery] = useRecoilState(searchFilter("narrative"));

  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);

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

  return (
    <FormContext {...formInstance}>
      <form onSubmit={handleSearch}>
        <Box position="relative">
          <Box>
            <TextField
              name={SEARCH_BOX}
              inputRef={formInstance.register}
              fullWidth
              autoFocus
              onChange={() => {
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setShowSuggestions(false);
              }}
              variant="outlined"
              placeholder="Search 35,000 police records"
              InputProps={{
                startAdornment: (
                  <Box marginRight={1}>
                    {query && (
                      <FilterChip
                        filterKey={"narrative"}
                        label={"Report contains"}
                        value={query}
                        onDelete={() => setQuery(undefined)}
                      />
                    )}
                  </Box>
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
  return (
    <Paper elevation={3}>
      <Box padding={2}>
        <FilterChip
          filterKey={"narrative"}
          label={"Report contains"}
          value={searchValue}
        />
      </Box>
    </Paper>
  );
};

export default SearchBox;
