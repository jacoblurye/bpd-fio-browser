import React from "react";
import {
  Button,
  useScrollTrigger,
  Grid,
  Fade,
  Tooltip,
} from "@material-ui/core";
import { ArrowUpward } from "@material-ui/icons";

const ScrollToTop: React.FC = ({ children }) => {
  const topRef = React.useRef<HTMLDivElement>(null);
  const showButton = useScrollTrigger({ disableHysteresis: true });

  const ScrollButton = () => (
    <Grid
      container
      justify="center"
      style={{ position: "fixed", top: 5, width: "100%", zIndex: 999999 }}
    >
      <Grid item>
        <Tooltip title="scroll to top">
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => {
              if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <ArrowUpward />
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );

  console.log;

  return (
    <>
      <div ref={topRef} />
      {children}
      <Fade in={showButton}>
        <div>
          <ScrollButton />
        </div>
      </Fade>
    </>
  );
};

export default ScrollToTop;
