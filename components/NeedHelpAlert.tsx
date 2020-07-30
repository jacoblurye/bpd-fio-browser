import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Box, List, ListItem, ListItemIcon } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import exampleRoutes from "utils/example-routes";
import { Search } from "@material-ui/icons";
import { useLocalStorage } from "utils/hooks";

const NeedHelpAlert: React.FC = () => {
  const router = useRouter();
  const [dismissed, setDismissed] = useLocalStorage("helpAlertDismissed", "");

  const searchIcon = (
    <ListItemIcon>
      <Search />
    </ListItemIcon>
  );

  return !dismissed ? (
    <Box marginY={1}>
      <Alert
        variant="outlined"
        severity="info"
        onClose={() => setDismissed("true")}
      >
        <AlertTitle>First time visiting the site?</AlertTitle>
        Here are a few searches to get you started.
        <List dense>
          <ListItem button onClick={() => router.push(exampleRoutes.nervous)}>
            {searchIcon}
            FIOs whose reports contain the word "nervous"
          </ListItem>
          <ListItem button onClick={() => router.push(exampleRoutes.gangDB)}>
            {searchIcon}
            FIOs whose reports contain either the phrase "gang database" or
            "bric"
          </ListItem>
          <ListItem button onClick={() => router.push(exampleRoutes.unit)}>
            {searchIcon}
            FIOs conducted by officers in a particular unit
          </ListItem>
          <ListItem button onClick={() => router.push(exampleRoutes.nervous)}>
            {searchIcon}
            FIOs conducted by a single officer
          </ListItem>
          <ListItem button onClick={() => router.push(exampleRoutes.complex)}>
            {searchIcon}
            FIOs conducted in the South End involving a frisk search, whose
            reports contain the word "homeless"
          </ListItem>
        </List>
      </Alert>
    </Box>
  ) : null;
};

export default NeedHelpAlert;
