const axios = require("axios");
require("dotenv").config();

// Define access parameters
const accessToken = process.env.PROBLEM_ACCESS_TOKEN;
const endpoint = process.env.PROBLEM_ENDPOINT;

const createTestCase = async (req, res) => {
  // Define request parameters
  const problemId = 42;
  const testcaseData = {
    input: "Input",
    output: "Output",
    timelimit: 5,
    judgeId: 1,
  };

  // Send request
  axios
    .post(
      `https://${endpoint}/api/v4/problems/${problemId}/testcases?access_token=${accessToken}`,
      testcaseData
    )
    .then((response) => {
      if (response.status === 201) {
        console.log(response.data);
      } else {
        if (response.status === 401) {
          console.log("Invalid access token");
        } else if (response.status === 403) {
          console.log("Access denied");
        } else if (response.status === 404) {
          console.log("Problem does not exist");
        } else if (response.status === 400) {
          const body = response.data;
          console.log(
            `Error code: ${body.error_code}, details available in the message: ${body.message}`
          );
        }
      }
    })
    .catch((error) => {
      console.log("Connection problem", error);
    });
};
module.exports = { createTestCase };
