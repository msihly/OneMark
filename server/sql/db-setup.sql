CREATE DATABASE onemark;
USE onemark;

/* --------------------------------- TABLES --------------------------------- */
CREATE TABLE IF NOT EXISTS user (
    userId          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username        VARCHAR(255) NOT NULL,
    passwordHash    VARCHAR(255) NOT NULL,
    email           VARCHAR(2083) NOT NULL,
    accessLevel     TINYINT DEFAULT 0,
    verified        TINYINT DEFAULT 0,
    active          TINYINT DEFAULT 1,
    dateCreated     DATETIME,
        PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS token (
    tokenId         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    token           VARCHAR(2083) NOT NULL,
    expiryDate      DATETIME NOT NULL,
    userId          INT UNSIGNED NOT NULL,
        PRIMARY KEY (tokenId)
);

CREATE TABLE IF NOT EXISTS images (
    imageId         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    imageUrl   		VARCHAR(94) NOT NULL,
    imageHash       VARCHAR(32) NOT NULL UNIQUE,
    imageSize       INT,
    dateCreated     DATETIME,
        PRIMARY KEY (imageId)
);

CREATE TABLE IF NOT EXISTS bookmark (
    bookmarkId      INT UNSIGNED NOT NULL AUTO_INCREMENT,
	title			VARCHAR(2083) NOT NULL,
	pageUrl			VARCHAR(2083) NOT NULL,
    views           INT UNSIGNED DEFAULT 0,
    dateCreated     DATETIME,
    dateModified    DATETIME,
    imageId		    INT UNSIGNED,
	userId			INT UNSIGNED NOT NULL,
        PRIMARY KEY (bookmarkId)
);

CREATE TABLE IF NOT EXISTS tag (
    tagId           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tagText         VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (tagId)
);

CREATE TABLE IF NOT EXISTS bookmarkTag (
    bookmarkId      INT UNSIGNED NOT NULL,
    tagId           INT UNSIGNED NOT NULL,
        PRIMARY KEY (bookmarkId, tagId)
);

/* ------------------------------ FOREIGN KEYS ------------------------------ */
ALTER TABLE token
    ADD CONSTRAINT fk_token_user
        FOREIGN KEY (userId) REFERENCES user (userId);

ALTER TABLE bookmark
    ADD CONSTRAINT fk_bookmark_user
        FOREIGN KEY (userId) REFERENCES user (userId),
    ADD CONSTRAINT fk_bookmark_images
        FOREIGN KEY (imageId) REFERENCES images (imageId)
            ON DELETE SET NULL;

ALTER TABLE bookmarkTag
    ADD CONSTRAINT fk_bookmarkTag_bookmark
        FOREIGN KEY (bookmarkId) REFERENCES bookmark (bookmarkId)
            ON DELETE CASCADE,
    ADD CONSTRAINT fk_bookmarkTag_tag
        FOREIGN KEY (tagId) REFERENCES tag (tagId)
            ON DELETE CASCADE;