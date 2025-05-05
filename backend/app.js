//const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
//const pool = require("./db");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const mariadb = require('mariadb');
const { getAssignmentsByUser, getUserGroups, getUserProfile } = require('./db');

//dotenv.config({ path: "./.env" });

const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:8080',
    credentials: true
}));

// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: '3100Final',
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
    ssl: false ,
    port: 3307,
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
        "SELECT * FROM tblSessions WHERE sessionID = ? AND userID = ?",
            [sessionID, userID]
        );
    
        //If the session doesn't exist
        if (result[0].length === 0 /*|| userSessionResult === 0*/) {
            return false;
        } else {
            //Update the last activity
            await connection.execute(
                "UPDATE tblSessions SET lastUsedDateTime = NOW() WHERE sessionID = ?",
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
    console.log(req.body);
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
        connection = await pool.getConnection();

        //Check if the username is already in use
        try {
            const exitingQuery = "SELECT * FROM tblUsers WHERE username = ? AND email = ?";
            const existingParams = [username, email];
            const existing = await connection.query(exitingQuery, existingParams);
        
            if(existing.length > 0) {
                return res.status(400).json({ error: "Username or email already in use." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error checking for existing username." });
        }

        //Insert the user into the database
        try {
            //Get the current date and time
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

            //Insert the user into the database
            const insertQuery = "INSERT INTO tblUsers (userID, username, firstName, lastName, tNumber, email, password, creationDateTime, lastLoginDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const insertParams = [userID, username, fname, lname, tNumber, email, hashedPassword, formattedDate, formattedDate];
            await connection.query(insertQuery, insertParams);
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

    let connection;
    try {
        connection = await pool.getConnection();

        //Check if the user exists
        try {
            const userQuery = "SELECT * FROM tblUsers WHERE username = ?";
            const user = await connection.query(userQuery, [username]);
            if(user.length === 0) {
                return res.status(400).json({ error: "Invalid username or password." });
            }

            //Compare passwords
            const hashedPassword = user[0].password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            if(!passwordMatch) {
                return res.status(400).json({ error: "Invalid username or password." });
            }

            //Generate a sessionID
            const sessionID = uuidv4();
            const userID = user[0].userID;

            //Insert the sessionID into the database
            try{
                const sessionQuery = "INSERT INTO tblSessions (sessionID, userID, startDateTime, lastUsedDateTime, status) VALUES (?, ?, NOW(), NOW(), 'active')";
                await connection.execute(sessionQuery, [sessionID, userID]);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error inserting sessionID into database." });
            }

            //Set sessionID and userID as cookies
            res.cookie("sessionID", sessionID, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 1000 * 60 * 60 * 24 // 1 day
            });
            
            res.cookie("userID", userID, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 1000 * 60 * 60 * 24 // 1 day 
            });

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

//Vertify the session to get to the dashboard
app.get("/api/dashboard", async (req, res) => {
    const sessionID = req.cookies.sessionID;
    const userID = req.cookies.userID;

    //Check if the session is valid
    const isValid = await isValidSession(sessionID, userID);
    if(!isValid) {
        return res.status(401).json({ error: "Invalid session." });
    }

    //If the session is valid, return the dashboard data
    res.status(200).json({ message: "Welcome to the dashboard!" });
});

// API to fetch user profile
app.get('/api/profile', async (req, res) => {
    const userID = req.cookies.userID;
    console.log("Cookies:", req.cookies);


    if (!userID) {
        return res.status(400).json({ error: 'Missing userID in cookies' });
    }

    try {
        const rawUser = await getUserProfile(userID);

        if (rawUser) {
            const profile = {
                username: rawUser.userName,
                firstName: rawUser.firstName,
                lastName: rawUser.lastName,
                tNumber: rawUser.tNumber,
                email: rawUser.email,
                phone: null,
                major: null,
                minor: null,
                instructorCount: 0,
                memberCount: 0,
                location: null,
                officeHours: null,
                bio: null
            };
            res.json(profile);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error retrieving profile:', err);
        res.status(500).json({ error: 'Server error' });
    }

    // DEBUGGING
    // console.log("==== /api/profile hit ====");
    // console.log("Request cookies:", req.cookies);

    // const userID = req.cookies.userID;

    // if (!userID) {
    //     console.warn("No userID cookie received!");
    //     return res.status(401).json({ error: "Missing userID cookie." });
    // }

    // res.status(200).json({ message: "User ID received", userID });
});

// API to fetch assignments for a user
app.get('/api/assignments', async (req, res) => {
    const userID = req.cookies.userID;

    if (!userID) {
        return res.status(400).json({ error: 'Missing userID in cookies' });
    }

    try {
        const assignments = await getAssignmentsByUser(userID);
        res.json(assignments);
    } catch (err) {
        console.error("Error retrieving assignments:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API to fetch user groups
app.get('/api/groups', async (req, res) => {
    try {
        const userID = req.cookies.userID;
        const groups = await getUserGroups(userID);

        if (!groups || groups.length === 0) {
            return res.status(404).json({ error: 'No groups found' });
        }

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});