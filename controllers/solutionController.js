const axios = require("axios");
require("dotenv").config();

// Define access parameters
const accessToken = process.env.PROBLEM_ACCESS_TOKEN;
const endpoint = process.env.PROBLEM_ENDPOINT;

const solutionController = async (req, res) => {
  // Define request parameters
  const submissionData = {
    problemId: 42,
    compilerId: 11,
    source: "source_code",
  };

  // Sending request to create submission
  axios
    .post(
      `https://${endpoint}/api/v4/submissions?access_token=${accessToken}`,
      submissionData
    )
    .then((submissionResponse) => {
      if (submissionResponse.status === 201) {
        const submissionId = submissionResponse.data.id;

        // Check submission status
        const checkSubmissionStatus = () => {
          axios
            .get(
              `https://${endpoint}/api/v4/submissions/${submissionId}?access_token=${accessToken}`
            )
            .then((statusResponse) => {
              if (statusResponse.status === 200) {
                const status = statusResponse.data.status;

                if (status === 0) {
                  // Submission is in the queue, check again after a delay
                  setTimeout(checkSubmissionStatus, 1000);
                } else if (status === 1) {
                  // Submission is being processed, check again after a delay
                  setTimeout(checkSubmissionStatus, 1000);
                } else if (status === 3) {
                  // Submission is correct
                  console.log("Success: Submission is correct");
                } else if (status === 4) {
                  // Submission is wrong, get error details
                  axios
                    .get(
                      `https://${endpoint}/api/v4/submissions/${submissionId}/output?access_token=${accessToken}`
                    )
                    .then((outputResponse) => {
                      if (outputResponse.status === 200) {
                        const errorDetails = outputResponse.data;
                        console.log("Error: Submission is wrong");
                        console.log("Error details:", errorDetails);
                      } else {
                        console.log("Error: Failed to retrieve output details");
                      }
                    })
                    .catch((error) => {
                      console.log(
                        "Error: Failed to retrieve output details",
                        error
                      );
                    });
                } else {
                  console.log("Error: Unknown submission status");
                }
              } else {
                console.log("Error: Failed to check submission status");
              }
            })
            .catch((error) => {
              console.log("Error: Failed to check submission status", error);
            });
        };

        // Start checking submission status, function call
        checkSubmissionStatus();
      } else {
        if (submissionResponse.status === 401) {
          console.log("Invalid access token");
        } else if (submissionResponse.status === 402) {
          console.log("Unable to create submission");
        } else if (submissionResponse.status === 400) {
          const body = submissionResponse.data;
          console.log(
            `Error code: ${body.error_code}, details available in the message: ${body.message}`
          );
        } else {
          console.log("Error: Unexpected response from the server");
        }
      }
    })
    .catch((error) => {
      console.log("Connection problem", error);
    });
};

module.exports = { solutionController };
