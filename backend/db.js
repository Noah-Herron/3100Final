const mariadb = require('mariadb');
// require("dotenv").config();

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

module.exports = pool;

// function to get user Profile
async function getUserProfile(userID) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(`
            SELECT userName, firstName, lastName, tNumber, email
            FROM tblUsers
            WHERE userID = ?
        `, [userID]);

        return rows[0]; // this returns undefined if not found
    } catch (err) {
        console.error("Error in getUserProfile:", err);
        return null;
    } finally {
        conn.release();
    }
}

// functoin to get user Assignments
async function getAssignmentsByUser(userID) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM tblassignments WHERE userID = ?", [userID]);
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
    getAssignmentsByUser,
    getUserGroups
};