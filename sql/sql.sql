CREATE DATABASE datingcoach;

CREATE TABLE login(
  username VARCHAR(35) NOT NULL PRIMARY KEY,
  user_type VARCHAR(26) NOT NULL
);

CREATE TABLE users(
  username VARCHAR(35) NOT NULL PRIMARY KEY,
  first_name VARCHAR(50),
  surname VARCHAR(50),
  gender VARCHAR(6),
  age INTEGER,
  description VARCHAR(150),
  profile_picture TEXT
);

CREATE TABLE gallery(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(35),
  image TEXT
);

-- type 1: likes
-- type 0: Dislikes
CREATE TABLE likes(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(35),
  description VARCHAR(50),
  type INTEGER
);

-- type 1: Own Qualities
-- type 0: Partner Qualities
CREATE TABLE qualities(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(35),
  description VARCHAR(50),
  type INTEGER
);

-- status 0: pending
-- status 1: reviewed
CREATE TABLE jobs(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dater VARCHAR(35),
  reviewer VARCHAR(35),
  status INTEGER
);

CREATE TABLE reviews(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  job_id INTEGER,
  description VARCHAR(150),
  rating INTEGER,
  rated BOOLEAN DEFAULT FALSE
);

CREATE TABLE ratings(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(35),
  rating INTEGER
);
