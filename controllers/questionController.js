const axios = require("axios");
const Question = require("../models/questionModel");
require("dotenv").config();

// Define access parameters
const accessToken = process.env.PROBLEM_ACCESS_TOKEN;
const endpoint = process.env.PROBLEM_ENDPOINT;

const createQuestion = async (req, res) => {
  try {
    // Getting the question data from the request body
    const { name, masterjudgeId } = req.body;
    const problemData = {
      name,
      masterjudgeId,
    };

    // Sending the request to create the question
    const response = await axios.post(
      `https://46ed4108.problems.sphere-engine.com/api/v4/problems/?access_token=4b6e01f737c926f1f7b82bb306185d49`,
      problemData
    );

    if (response.status === 201) {
      const questionData = response.data;

      // Saving the created question to the database
      const question = await Question.create(questionData);

      res.status(201).json(question);
    } else {
      if (response.status === 401) {
        console.log("Invalid access token");
        res.status(401).json({ error: "Invalid access token" });
      } else if (response.status === 400) {
        const responseBody = response.data;
        console.log("Error code:", responseBody.error_code);
        console.log("Message:", responseBody.message);
        res.status(400).json(responseBody);
      } else {
        res.status(response.status).json({ error: "!error" });
      }
    }
  } catch (error) {
    console.error("Connection problem", error);
    res.status(500).json({ error: "Connection problem" });
  }
};

const deleteQuestion = async (req, res) => {
  const problemId = req.params.id;

  try {
    const response = await axios.delete(
      `https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`
    );

    if (response.status === 200) {
      // Removing the question from the database
      Question.findByIdAndDelete(problemId)
        .then(() => {
          res.status(200).json({ message: "Question deleted" });
        })
        .catch((error) => {
          console.error("Error deleting question:", error);
          res.status(500).json({ error: "Error deleting question" });
        });
    } else {
      if (response.status === 401) {
        console.log("Invalid access token");
        res.status(401).json({ error: "Invalid access token" });
      } else if (response.status === 403) {
        console.log("Access denied");
        res.status(403).json({ error: "Access denied" });
      } else if (response.status === 404) {
        console.log("Question not found");
        res.status(404).json({ error: "Question not found" });
      } else {
        res.status(response.status).json({ error: "Unexpected error" });
      }
    }
  } catch (error) {
    console.log("Connection problem");
    res.status(500).json({ error: "Connection problem" });
  }
};

const updateQuestion = async (req, res) => {
  const problemId = req.params.id;
  const problemData = req.body;

  try {
    const response = await axios.put(
      `https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`,
      problemData
    );

    if (response.status === 200) {
      // Updating the question in the database
      Question.findByIdAndUpdate(problemId, problemData, { new: true })
        .then((question) => {
          res.status(200).json(question);
        })
        .catch((error) => {
          console.error("Error updating question:", error);
          res.status(500).json({ error: "Error updating question" });
        });
    } else {
      if (response.status === 401) {
        console.log("Invalid access token");
        res.status(401).json({ error: "Invalid access token" });
      } else if (response.status === 403) {
        console.log("Access denied");
        res.status(403).json({ error: "Access denied" });
      } else if (response.status === 404) {
        console.log("Question does not exist");
        res.status(404).json({ error: "Question does not exist" });
      } else if (response.status === 400) {
        const responseBody = response.data;
        console.log("Error code:", responseBody.error_code);
        console.log("Message:", responseBody.message);
        res.status(400).json(responseBody);
      } else {
        res.status(response.status).json({ error: "Unexpected error" });
      }
    }
  } catch (error) {
    console.log("Connection problem");
    res.status(500).json({ error: "Connection problem" });
  }
};

module.exports = { createQuestion, deleteQuestion, updateQuestion };
