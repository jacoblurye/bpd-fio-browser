import React from "react";
import { makeStyles, Grid, Typography, Box, Chip } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  headerLink: {
    textDecoration: "none",
    cursor: "pointer",
    color: theme.palette.grey[600],
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  selected: {
    color: theme.palette.text.primary,
  },
}));

type HeaderLinkProps = {
  href: string;
};

const HeaderLink: React.FC<HeaderLinkProps> = ({ href, children }) => {
  const classes = useStyles();
  const router = useRouter();

  const className = `${classes.headerLink}${
    router.route === href ? ` ${classes.selected}` : ""
  }`;

  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};

const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container justify="space-between" alignItems="baseline" spacing={2}>
      <Grid item>
        <Grid container alignItems="center" spacing={1} wrap="nowrap">
          <Grid item>
            <Typography variant="overline">
              <Box className={classes.title}>
                <HeaderLink href="/">BPD FIO Browser</HeaderLink>
              </Box>
            </Typography>
          </Grid>
          <Grid item>
            <Chip size="small" variant="outlined" label="BETA" />
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary">
          Search 44,000 Boston police stop reports
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={2} wrap="nowrap">
          <Grid item>
            <HeaderLink href="/about">
              <Typography>About</Typography>
            </HeaderLink>
          </Grid>
          <Grid item>
            <HeaderLink href="/feedback">
              <Typography>Feedback</Typography>
            </HeaderLink>
          </Grid>
          <Grid item>
            <a
              className={classes.headerLink}
              href="https://github.com/jacoblurye/bpd-fio-browser"
              target="_blank"
            >
              <Typography>GitHub</Typography>
            </a>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
