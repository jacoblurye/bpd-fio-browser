import Layout from "components/Layout";
import { Box } from "@material-ui/core";

const FeedbackPage = () => {
  return (
    <Layout title="Feedback">
      <Box textAlign="center">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfPBWGFsG2VZdL5By-AmOE17FCZuMa0zXlbk43hw3KKm4g1jA/viewform?embedded=true"
          height={1000}
          width="100%"
          frameBorder={0}
          marginHeight={0}
          marginWidth={0}
        >
          Loading…
        </iframe>
      </Box>
    </Layout>
  );
};

export default FeedbackPage;
