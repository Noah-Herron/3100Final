//Attempt 1
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

//RegEx Expressions
const usernameRegEx = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;      // 3-20 characters, letters, numbers, underscores, and hyphens only
const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/      // 8-64 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
const tRegEx = /^T\d{8}$/       // T followed by 8 digits
const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;      // Email format

//Helper Functions
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
    //What should be passed in
    const { username, fname, lname, tNumber, email, password, confirmPassword } = req.body;

    //Make sure all the data is valid
    if(!usernameRegEx.test(username)) {
        return res.status(400).json({ error: "Invalid username." });
    }
    if(!passwordRegEx.test(password)) {
        return res.status(400).json({ error: "Invalid password." });
    }
    if(password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }
    if(!tRegEx.test(tNumber)) {
        return res.status(400).json({ error: "Invalid T-Number." });
    }
    if(!emailRegEx.test(email)) {
        return res.status(400).json({ error: "Invalid email." });
    }
    if(fname.length < 1 || lname.length < 1) {
        return res.status(400).json({ error: "First and last name are required." });
    }

    //Hash and salt the password before putting it into the database
    const hashedPassword = await hashPassword(password);

    let connection;
    try {
        connection = await pool.getConnection();

        //Check if the username is already in use
        try {
            const exitingQuery = "SELECT * FROM users WHERE username = ?";
            const [existing] = await connection.query(exitingQuery, [username]);
            if(existing.length > 0) {
                return res.status(400).json({ error: "Username already in use." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error checking for existing username." });
        }

        //Insert the user into the database
        try {
            const insertQuery = "INSERT INTO users (username, fname, lname, tNumber, email, password) VALUES (?, ?, ?, ?, ?, ?)";
            await connection.query(insertQuery, [username, fname, lname, tNumber, email, hashedPassword]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error inserting user into database." });
        }

        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error connecting to database." });
    } finally {
        if(connection) {
            connection.release();
        }
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});