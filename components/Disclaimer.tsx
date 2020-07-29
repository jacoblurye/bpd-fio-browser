import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
import { useLocalStorage } from "utils/hooks";

const Disclaimer: React.FC = () => {
  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", "");

  return (
    <Dialog open={!hasVisited}>
      <DialogTitle>Disclaimer</DialogTitle>
      <DialogContent>
        <Typography paragraph>
          The police report information on this site comes from the Boston
          Police Department's Field Interrogation and Observation (FIO){" "}
          <Link
            href="https://data.boston.gov/dataset/boston-police-department-fio"
            target="_blank"
          >
            dataset
          </Link>
          . The data is displayed as reported by the BPD, aside from minor
          cleanup (
          <Link
            href="https://github.com/jacoblurye/bpd-fio-data"
            target="_blank"
          >
            details here
          </Link>
          ).
        </Typography>
        <Typography paragraph>
          These FIO reports constitute police officers' accounts of
          officer-initiated civilian stops. The reports give us insight into
          where those officers were active, who they were stopping, and how they
          justified those stops. However, the reliability of the information
          expressed in these accounts <strong>cannot</strong> be guaranteed.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHasVisited("true")}>I Understand</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Disclaimer;
