const express = require("express");
const path = require("path");
const https = require("https");
require("dotenv").config();

const app = express();

// static folder for storing static local resources
app.use(express.static("static"));
// for accessing the request body that is sent to us
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/signup.html"));
});

app.post("/", (req, res) => {
    const userObj = {
        members: [
            {
                email_address: req.body.emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.firstName,
                    LNAME: req.body.lastName,
                },
            },
        ],
    };

    const userData = JSON.stringify(userObj);

    const url =
        "https://us19.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;
    const options = {
        method: "POST",
        auth: "soumya:" + process.env.API_KEY,
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, "/success.html"));
        } else {
            res.sendFile(path.join(__dirname, "/failure.html"));
        }
    });

    // actually writing the data to mailchimp
    request.write(userData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

// listining to the dynamic port if available, otherwise to port 3000 in localhost
app.listen(process.env.PORT || 3000, () =>
    console.log("Server running successfully.")
);
