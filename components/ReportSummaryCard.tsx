import React from "react";
import { FieldContact } from "interfaces";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  ChipProps,
  makeStyles,
} from "@material-ui/core";
// import moment from "moment-timezone";

const UNKNOWN = "(unknown)";

const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const useStyles = makeStyles({
  inlineText: {
    display: "inline",
  },
  inlineSearchText: {
    display: "inline",
    border: "1px dashed black",
    borderRadius: 5,
    padding: 1,
  },
});

interface EmojiChipProps extends ChipProps {
  emoji: string;
  label: string;
}

const EmojiChip: React.FC<EmojiChipProps> = ({ emoji, label, ...props }) => {
  return (
    <Chip
      size="small"
      label={
        <Grid container spacing={1} alignItems="baseline" wrap="nowrap">
          <Grid item>
            <Typography>{emoji}</Typography>
          </Grid>
          <Grid item>
            <Typography>{label}</Typography>
          </Grid>
        </Grid>
      }
      {...props}
    />
  );
};

export interface ReportSummaryCardProps {
  report: FieldContact;
  searchTerm: string;
}

const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({
  report,
  searchTerm,
}) => {
  const classes = useStyles();

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const narrativeChunks = report.narrative
    ? report.narrative.split(lowerCaseSearchTerm)
    : [];
  const lastChunk = narrativeChunks.length - 1;

  const officerName = report.contactOfficerName
    ? titleCase(report.contactOfficerName)
    : UNKNOWN;

  const basis = titleCase(report.basis || UNKNOWN);
  // const contactTime =
  //   moment(report.contactDate).tz("EST").format("MMM. D YYYY @ hh:mm A") +
  //   " (WRONG)";

  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <EmojiChip
                  emoji={"🚓"}
                  label={officerName}
                  onClick={() => alert(report.contactOfficerName)}
                />
              </Grid>
              <Grid item>
                <EmojiChip emoji={"❓"} label={basis} />
              </Grid>
              {report.people.map((person, i) => {
                const race = person.race || UNKNOWN;
                const gender = person.sex || UNKNOWN;
                const profile =
                  !person.race && !person.sex
                    ? UNKNOWN
                    : titleCase(`${race} ${gender}`);
                return (
                  <Grid key={i} item>
                    <EmojiChip emoji={"👤"} label={profile} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item>
            {narrativeChunks.map((chunk, i) => {
              return (
                <React.Fragment key={i}>
                  <Typography className={classes.inlineText}>
                    {chunk}
                  </Typography>
                  {i !== lastChunk && (
                    <Typography className={classes.inlineSearchText}>
                      {searchTerm}
                    </Typography>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReportSummaryCard;
