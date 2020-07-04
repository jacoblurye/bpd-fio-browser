import React from "react";
import { searchQuery } from "state";
import { IconButton, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { useSetRecoilState } from "recoil";

const SEARCH_BOX = "search-box";

const SearchBox: React.FC = () => {
  const router = useRouter();
  const { handleSubmit, register, setValue, getValues } = useForm();
  const setQuery = useSetRecoilState(searchQuery);

  React.useEffect(() => {
    // Sync the searchbox value with the `q` query param
    const q = router.query.q as string;
    if (q && q !== getValues()[SEARCH_BOX]) {
      setValue(SEARCH_BOX, q);
      handleSearch();
    }
  }, [router]);

  // Execute a search query based on the search box contents
  const handleSearch = handleSubmit(({ [SEARCH_BOX]: q }) => {
    setQuery(q);
    const query = q ? { q } : undefined;
    router.push({ pathname: router.pathname, query });
    // Clear searchbox focus
    // @ts-ignore
    document.activeElement?.blur();
  });

  return (
    <form onSubmit={handleSearch}>
      <TextField
        name={SEARCH_BOX}
        inputRef={register}
        fullWidth
        autoFocus
        variant="outlined"
        placeholder="Search 35,000 police records"
        InputProps={{
          endAdornment: (
            <IconButton style={{ background: "none" }} onClick={handleSearch}>
              <Search />
            </IconButton>
          ),
        }}
        autoComplete="off"
        autoCorrect="off"
      />
    </form>
  );
};

export default SearchBox;
