CREATE DATABASE labtechfinder;

DROP TABLE IF EXISTS laboratories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS skills;

CREATE TABLE laboratories (
    labid SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    email TEXT
);


CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    labid INTEGER,
    name TEXT,
    role TEXT,
    email TEXT,
    digpassword TEXT,
    photo TEXT,
    accesslevel INTEGER
);

CREATE TABLE skills (
    labid INTEGER,
    userid INTEGER,
    skill TEXT
);

CREATE TABLE messages (
    messageid SERIAL PRIMARY KEY,
    labid INTEGER,
    sender TEXT,
    receiverid INTEGER,
    subject TEXT,
    message TEXT
)