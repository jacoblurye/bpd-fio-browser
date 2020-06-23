import React from "react";
import { FieldContact } from "interfaces";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  ChipProps,
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

interface EmojiChipProps extends ChipProps {
  emoji: string;
  label: string;
}

const EmojiChip: React.FC<EmojiChipProps> = ({ emoji, label, ...props }) => {
  return (
    <Chip
      label={
        <Grid container spacing={1} alignItems="baseline">
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
  const narrativeChunks = report.narrative
    ? report.narrative.split(searchTerm)
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
              {report.people.map((person) => {
                const race = person.race || UNKNOWN;
                const gender = person.sex || UNKNOWN;
                const profile =
                  !person.race && !person.sex
                    ? UNKNOWN
                    : titleCase(`${race} ${gender}`);
                return (
                  <Grid item>
                    <EmojiChip emoji={"👤"} label={profile} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item>
            {narrativeChunks.map((chunk, i) => {
              return (
                <>
                  <Typography style={{ display: "inline" }}>{chunk}</Typography>
                  {i !== lastChunk && (
                    <Typography
                      style={{
                        display: "inline",
                        border: "1px dashed black",
                        borderRadius: 5,
                        padding: 1,
                      }}
                    >
                      {searchTerm}
                    </Typography>
                  )}
                </>
              );
            })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default React.memo(ReportSummaryCard, () => {
  return true;
});
