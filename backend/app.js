//const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
//const pool = require("./db");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const mariadb = require('mariadb');

//dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'GuitarStrummer123',
    database: '3100Final',
    connectionLimit: 5
});

const PORT = process.env.PORT || 5000;

//RegEx Expressions
const usernameRegEx = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;      // 3-20 characters, letters, numbers, underscores, and hyphens only
const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-=+/])[A-Za-z\d!@#$%^&*\-=+/]{8,}$/;
const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const tRegEx = /^T\d{8}$/;

//Helper Functions
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

//Validate the Session
async function isValidSession(sessionID, userID) {
    //Make sure the session exists
    let connection;
    try {
        connection = await pool.getConnection();

    //Validate the session
    const result = await connection.execute(
      "SELECT * FROM tblSession WHERE sessionID = ? AND expiresAt > NOW()",
        [sessionID]
    );

    //Check to see if there is a user with this session
    const userSessionResult = await connection.execute("SELECT * FROM tblUser WHERE sessionID = ? AND userID = ?", [sessionID, userID]);
    if(userSessionResult.length === 0){
        return false;
    }
    
    //If the session doesn't exist
    if (result.length === 0 /*|| userSessionResult === 0*/) {
        return false;
    } else {
      //Update the last activity
        await connection.execute(
        "UPDATE tblSession SET expiresAt = NOW() + INTERVAL 5 MINUTE WHERE sessionID = ?",
        [sessionID]
        );
      //Return true if the check
        return true;
    }
    } catch (error) {
        console.error("Error checking session", error);
        return false;
    } finally {
        if (connection) connection.release();
    }  
}

//To make sure the api works
app.get("/api", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/ping", async (req, res) => {
    console.log(process.env);

    
    const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'GuitarStrummer123',
        database: '3100Final',
        connectionLimit: 5
    });

    try {
        const connection = await pool.getConnection();
        console.log("Connected to the database!");
        await connection.ping();
        console.log("Ping successful.");
        connection.end();
    } catch (err) {
        console.error("Error:", err);
    }
});

//Signup Route
app.post("/api/signup", async (req, res) => {
    //What should be passed in
    const { username, fname, lname, tNumber, email, password, confirmPassword } = req.body;
    const userID = uuidv4();

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
        console.log("Connecting to the database...");
        connection = await pool.getConnection();
        console.log("Connected to the database.");

        //Check if the username is already in use
        try {
            const exitingQuery = "SELECT * FROM tblUsers WHERE username = ?";
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
            const insertQuery = "INSERT INTO tblUsers (userID, username, fname, lname, tNumber, email, password) VALUES (?, ?, ?, ?, ?, ?)";
            await connection.query(insertQuery, [userID, username, fname, lname, tNumber, email, hashedPassword]);
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

//Login Route
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    //Salt and Hash the Password
    const hashedPassword = await hashPassword(password);

    let connection;
    try {
        connection = await pool.getConnection();

        //Check if the user exists
        try {
            const userQuery = "SELECT * FROM tblUsers WHERE username = ? AND password = ?";
            const [user] = await connection.query(userQuery, [username, hashedPassword]);
            if(user.length === 0) {
                return res.status(400).json({ error: "Invalid username or password." });
            }

            //Generate a sessionID
            const sessionID = uuidv4();
            const userID = user[0].userID;

            //Insert the sessionID into the database
            try{
                const sessionQuery = "INSERT INTO tblSessions (sessionID, userID) VALUES (?, ?)";
                await connection.execute(sessionQuery, [sessionID, userID]);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error inserting sessionID into database." });
            }

            //Set sessionID and userID as cookies
            res.cookie("sessionID", sessionID, { httpOnly: true });
            res.cookie("userID", userID, { httpOnly: true });

            return res.status(200).json({ message: "Login successful." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error checking for existing user." });
        }
    } catch (error){
        res.status(500).json({ error: "Error connecting to database." });
        console.error("Error connecting to the database.");
    } finally {
        if(connection) {
            connection.release();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});