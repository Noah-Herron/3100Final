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

-- Create Tables
CREATE TABLE IF NOT EXISTS `tblUsers` (
    `userID` CHAR(36) PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `fname` VARCHAR(50) NOT NULL,
    `lname` VARCHAR(50) NOT NULL,
    `tnumber` CHAR(9) NOT NULL
);

CREATE TABLE IF NOT EXISTS `tblSession` (
    sessionID CHAR(36) PRIMARY KEY,
    userID CHAR(36) NOT NULL,
    startDatetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastActivityDatetime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userAgent TEXT,
    ipAddress VARCHAR(45),
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userID) REFERENCES tblUsers(userID) ON DELETE CASCADE ON UPDATE CASCADE
);