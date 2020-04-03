const express = require("express");
const path = require("path");
const https = require("https");

const app = express();

app.use(express.static("static"));
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
                    LNAME: req.body.lastName
                }
            }
        ]
    };

    const userData = JSON.stringify(userObj);

    const url = "https://us19.api.mailchimp.com/3.0/lists/f5a519df33";
    const options = {
        method: "POST",
        auth: "soumya:68f98417fbd88ab360d68e5e431e3aa3-us19"
    };

    const request = https.request(url, options, response => {
        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, "/success.html"));
        } else {
            res.sendFile(path.join(__dirname, "/failure.html"));
        }
    });
    request.write(userData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => console.log("Server running successfully."));

// mailchimp api: 68f98417fbd88ab360d68e5e431e3aa3-us19
// mailchimp listid: f5a519df33