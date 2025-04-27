-- Create Database
CREATE DATABASE IF NOT EXISTS `3100Final`;

-- Select Database
USE `3100Final`;

-- Drop Tables if they exist
DELIMITER $$

CREATE PROCEDURE DropAllTables()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tableName VARCHAR(255);
    DECLARE cur CURSOR FOR 
        SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '3100Final';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET FOREIGN_KEY_CHECKS = 0; -- Disable foreign key checks

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO tableName;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET @dropTableSQL = CONCAT('DROP TABLE IF EXISTS ', tableName);
        PREPARE stmt FROM @dropTableSQL;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
    SET FOREIGN_KEY_CHECKS = 1; -- Enable foreign key checks
END $$

DELIMITER ;

CALL DropAllTables(); -- Call the procedure to drop all tables
DROP PROCEDURE IF EXISTS DropAllTables; -- Drop the procedure after use

-- Users Table
CREATE TABLE tblUsers (
    userID VARCHAR(255) PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    creationDateTime TEXT NOT NULL,
    lastLoginDateTime TEXT
);
 
-- Courses Table
CREATE TABLE tblCourses (
    courseID VARCHAR(255) PRIMARY KEY,
    courseName TEXT NOT NULL,
    courseNumber TEXT NOT NULL,
    courseSection TEXT NOT NULL,
    courseTerm TEXT NOT NULL,
    startDate TEXT NOT NULL
);
 
-- Enrollment Table
CREATE TABLE tblEnrollment (
    enrollmentID VARCHAR(255) PRIMARY KEY,
    courseID VARCHAR(255) NOT NULL,
    userID VARCHAR(255) NOT NULL,
    FOREIGN KEY (courseID) REFERENCES tblCourses(courseID),
    FOREIGN KEY (userID) REFERENCES tblUsers(userID)
);
 
-- Contact Info Table
CREATE TABLE tblContactInfo (
    contactID VARCHAR(255) PRIMARY KEY,
    nationCode TEXT NOT NULL,
    areaCode TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    status TEXT NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    FOREIGN KEY (userEmail) REFERENCES tblUsers(email)
);
 
-- Socials Table
CREATE TABLE tblSocials (
    socialID VARCHAR(255) PRIMARY KEY,
    socialType TEXT NOT NULL,
    username TEXT NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    FOREIGN KEY (userEmail) REFERENCES tblUsers(email)
);
 
-- Assessments Table
CREATE TABLE tblAssesments (
    assesmentID VARCHAR(255) PRIMARY KEY,
    courseID VARCHAR(255) NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (courseID) REFERENCES tblCourses(courseID)
);
 
-- Assessment Questions Table
CREATE TABLE tblAssesmentsQuestions (
    questionID VARCHAR(255) PRIMARY KEY,
    questionType TEXT NOT NULL,
    options TEXT,
    questionNarative TEXT NOT NULL,
    helperText TEXT
);
 
-- Assessment Responses Table
CREATE TABLE tblAssesmentsResponse (
    responseID VARCHAR(255) PRIMARY KEY,
    assesmentID VARCHAR(255) NOT NULL,
    userID VARCHAR(255) NOT NULL,
    questionID VARCHAR(255) NOT NULL,
    response TEXT NOT NULL,
    targetUserID VARCHAR(255),
    public INTEGER NOT NULL CHECK (public IN (0, 1)),
    FOREIGN KEY (assesmentID) REFERENCES tblAssesments(assesmentID),
    FOREIGN KEY (userID) REFERENCES tblUsers(userID),
    FOREIGN KEY (questionID) REFERENCES tblAssesmentsQuestions(questionID),
    FOREIGN KEY (targetUserID) REFERENCES tblUsers(userID)
);
 
-- Course Groups Table
CREATE TABLE tblCoursegroups (
    groupID VARCHAR(255) PRIMARY KEY,
    groupName TEXT NOT NULL,
    courseID VARCHAR(255) NOT NULL,
    FOREIGN KEY (courseID) REFERENCES tblCourses(courseID)
);
 
-- Group Members Table
CREATE TABLE tblGroupMembers (
    groupMemberID VARCHAR(255) PRIMARY KEY,
    groupID VARCHAR(255) NOT NULL,
    userID VARCHAR(255) NOT NULL,
    FOREIGN KEY (groupID) REFERENCES tblCoursegroups(groupID),
    FOREIGN KEY (userID) REFERENCES tblUsers(userID)
);
 
-- Sessions Table
CREATE TABLE tblSessions (
    sessionID VARCHAR(255) PRIMARY KEY,
    userID VARCHAR(255) NOT NULL,
    startDateTime TEXT NOT NULL,
    lastUsedDateTime TEXT,
    status TEXT NOT NULL,
    FOREIGN KEY (userID) REFERENCES tblUsers(userID)
);
 
-- Logs Table
CREATE TABLE tblLogs (
    logID VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('error', 'info', 'warning')),
    dateTime TEXT NOT NULL
);