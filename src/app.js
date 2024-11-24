const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

const API_KEY =
  "3oy0Yyiqgfq5+syqE28uU4WFa7PvMkcuBlYvJpqWU6HAch46C99DNO/XbjiYI5FotDm6JhNinl8OUU122PkSiGe1RBzRdkWCzDva8GHbDMQCXnFyH9UeY7mEnAZVChFXGRcLg0McYuv0vaZJWMoeFQ==";
const LIST_ID = "a18165cccba0b3acb927b5c2618d57ac";
const BASE_URL = "https://api.createsend.com/api/v3.3/";

app.get("/activeSubscribers", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/lists/${LIST_ID}/active.json`,
      {
        auth: {
          username: API_KEY,
          password: "x",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/addSubscriber", async (req, res) => {
  const { email, name } = req.body;

  const data = {
    EmailAddress: email,
    Name: name,
    ConsentToTrack: "Yes",
    Resubscribe: true,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/subscribers/${LIST_ID}.json`,
      data,
      {
        auth: {
          username: API_KEY,
          password: "",
        },
      }
    );

    res.status(201).json({ email: response.data });
  } catch (error) {
    console.error(
      "Axios error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

app.delete("/deleteSubscriber", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await axios.delete(
      `${BASE_URL}/subscribers/${LIST_ID}.json`,
      {
        params: {
          email: email,
        },
        auth: {
          username: API_KEY,
          password: "",
        },
      }
    );

    if (response.status === 200) {
      res
        .status(200)
        .json({ message: `Subscriber ${email} deleted successfully.` });
    } else {
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  } catch (error) {
    console.error(
      "Error deleting subscriber:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

app.put("/updateSubscriber", async (req, res) => {
  const { oldEmail, email, name } = req.body;

  const data = {
    EmailAddress: email,
    Name: name,
    ConsentToTrack: "Yes",
    Resubscribe: true,
  };

  try {
    const response = await axios.put(
      `${BASE_URL}/subscribers/${LIST_ID}.json?email=${oldEmail}`,
      data,
      {
        auth: {
          username: API_KEY,
          password: "",
        },
      }
    );

    res.status(200).json({ email: response.data });
  } catch (error) {
    console.error(
      "Axios error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
