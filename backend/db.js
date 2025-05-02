const mariadb = require('mariadb');
require("dotenv").config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 20,
    connectionTimeout: 20000,
    acquireTimeout: 10000
});

module.exports = pool;

// function to get user Profile
async function getUserProfile(userID) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE id = ?", [userID]);
        return rows[0] || null; // first result
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

// functoin to get user Assignments
async function getUserAssignments(userID) {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            SELECT a.assesmentID, a.name, a.startDate, a.endDate, a.status, a.type, a.courseID, c.courseName
            FROM tblAssesments a
            JOIN tblCourses c ON a.courseID = c.courseID
            WHERE a.courseID IN (
                SELECT courseID FROM tblEnrollment WHERE userID = ?
            )
            ORDER BY a.startDate ASC
        `;

        const rows = await conn.query(query, [userID]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

// function to get groups
async function getUserGroups(userID) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT g.groupID, g.groupName, g.courseID, c.courseName
            FROM tblCoursegroups g
            JOIN tblGroupMembers gm ON g.groupID = gm.groupID
            JOIN tblCourses c ON g.courseID = c.courseID
            WHERE gm.userID = ?
        `;
        const rows = await conn.query(query, [userID]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

// Export both pool and function
module.exports = {
    pool,
    getUserProfile,
    getUserAssignments,
    getUserGroups
};