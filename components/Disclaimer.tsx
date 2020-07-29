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
      <DialogTitle>Notice</DialogTitle>
      <DialogContent>
        <Typography variant="body2" paragraph>
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
        <Typography variant="body2" paragraph>
          FIO reports contain police officers' accounts of officer-initiated
          civilian stops. In these reports, officers provide information about
          where they were active, who they stopped, and how they justified those
          stops. As such,{" "}
          <strong>
            these reports may be innaccurate or otherwise misrepresent police
            interactions with Boston residents.
          </strong>
        </Typography>
        <Typography variant="body2" paragraph>
          This site is not affiliated with the BPD.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHasVisited("true")}>I Understand</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Disclaimer;
