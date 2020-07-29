import Layout from "components/Layout";
import { Typography, Link } from "@material-ui/core";

const AboutPage = () => (
  <Layout title="About">
    <Typography variant="h5" color="textSecondary" paragraph>
      What is "FIO"?
    </Typography>

    <Typography paragraph>
      Every day in Boston, police officers stop, question, and frisk or search
      civilians as part of the BPD's Field Interrogation and Observation (FIO)
      program. The BPD tracks each of these stops in a private database. After a
      series of lawsuits and Freedom of Information Act requests, the BPD
      published the last four years or so of FIO data for public use on{" "}
      <Link href="https://data.boston.gov/dataset/boston-police-department-fio">
        data.boston.gov
      </Link>
      .
    </Typography>
    <Typography variant="h5" color="textSecondary" paragraph>
      Why does this website exist?
    </Typography>
    <Typography paragraph>
      The goal of this site is to make it easier for people to learn about
      police officer activity from the BPD's FIO dataset. While BPD FIO data
      might be of interest to a wide variety of people, its raw format is hard
      to work with of you don't have some sort of technical background. By
      providing an interactive interface, the BPD FIO Browser aims to
      democratize the process of analyzing this data.
    </Typography>
    <Typography paragraph>
      This is an open source project (
      <Link
        href="https://github.com/jacoblurye/bpd-fio-browser"
        target="_blank"
      >
        GitHub
      </Link>
      ) . It is not affiliated with any institutions, BPD or otherwise. Also,
      it's under active development - if you have any feedback or otherwise want
      to get in touch, please don't hesitate to{" "}
      <Link href="/feedback">reach out</Link>.
    </Typography>
    <Typography variant="h5" color="textSecondary" paragraph>
      Usage
    </Typography>
    <Typography paragraph>
      The BPD FIO Browser makes it easy to search through and summarize FIO
      data.
    </Typography>
    <Typography paragraph>
      You can filter FIO reports by{" "}
      <Link
        href="https://bpd-fio-browser.vercel.app/?filters=%5B%7B%22field%22%3A%22narrative%22%2C%22query%22%3A%nervous%22%7D%5D"
        target="_blank"
      >
        a single keyword
      </Link>{" "}
      or{" "}
      <Link
        href="https://bpd-fio-browser.vercel.app/?filters=%5B%7B%22field%22%3A%22narrative%22%2C%22query%22%3A%22hoodie%22%7D%5D"
        target="_blank"
      >
        {" "}
        set of keywords
      </Link>
      ; view all FIOs carried out by a{" "}
      <Link
        href="https://bpd-fio-browser.vercel.app/?filters=%5B%7B%22field%22%3A%22supervisorName%22%2C%22query%22%3A%22patrick%20byrne%22%7D%5D"
        target="_blank"
      >
        particular unit
      </Link>{" "}
      or{" "}
      <Link
        href="https://bpd-fio-browser.vercel.app/?filters=%5B%7B%22field%22%3A%22contactOfficerName%22%2C%22query%22%3A%22zachary%20andrew%20crossen%22%7D%5D"
        target="_blank"
      >
        police officer
      </Link>
      ; or combine all sorts of filters to create a{" "}
      <Link
        href="https://bpd-fio-browser.vercel.app/?filters=%5B%7B%22field%22%3A%22narrative%22%2C%22query%22%3A%22weed%22%7D%2C%7B%22field%22%3A%22basis%22%2C%22query%22%3A%22reasonable%20suspicion%22%7D%2C%7B%22field%22%3A%22fcInvolvedFriskOrSearch%22%2C%22query%22%3A%22y%22%7D%2C%7B%22field%22%3A%22includedRaces%22%2C%22query%22%3A%22black%22%7D%5D"
        target="_blank"
      >
        specialized view of the data
      </Link>
      . Click on pieces of data in your search results to drill down even
      further.
    </Typography>
    <Typography variant="h5" color="textSecondary" paragraph>
      Other Resources
    </Typography>
    <Typography paragraph>[Coming soon!]</Typography>
  </Layout>
);

export default AboutPage;
