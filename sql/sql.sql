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

INSERT INTO `gallery` (`id`, `username`, `image`) VALUES
(1, 'yasteel', 'blackCloverAsta.jpg');

INSERT INTO `jobs` (`id`, `dater`, `reviewer`, `status`) VALUES
(1, 'yasteel', 'Triya', 1),
(2, 'rowen', 'Triya', 1),
(3, 'yasteel', 'Aidan', 1);

INSERT INTO `likes` (`id`, `username`, `description`, `type`) VALUES
(1, 'rowen', 'Coding', 1),
(2, 'rowen', 'Cabs', 1),
(3, 'rowen', 'Toyota Drivers', 0),
(4, 'yasteel', 'Likes nothing', 1),
(5, 'yasteel', 'Dislikes everything', 0);

INSERT INTO `login` (`username`, `user_type`) VALUES
('Aidan', '2'),
('rowen', '1'),
('Triya', '2'),
('yasteel', '1');

INSERT INTO `qualities` (`id`, `username`, `description`, `type`) VALUES
(1, 'rowen', 'Madhir Coder', 1),
(2, 'rowen', 'Guitarist', 1),
(3, 'rowen', 'BT', 0),
(4, 'yasteel', 'Good ones', 1),
(5, 'yasteel', 'Not Bad Ones', 0);

INSERT INTO `ratings` (`id`, `username`, `rating`) VALUES
(1, 'Triya', 4),
(2, 'Aidan', 3);

INSERT INTO `reviews` (`id`, `job_id`, `description`, `rating`, `rated`) VALUES
(1, 1, 'Good profile but do upload relevant images', 3, 1),
(2, 2, 'what is BT...bluetooth?', 3, 0),
(3, 3, 'Good profile...why do you even need a coach', 4, 1);

INSERT INTO `users` (`username`, `first_name`, `surname`, `gender`, `age`, `description`, `profile_picture`) VALUES
('Aidan', 'Aidan', 'Sivnath', 'Male', 21, 'When', '499137.jpg'),
('rowen', 'Rowen', 'Singh', 'Male', 22, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis animi similique expedita vel eos repellendus fugiat, delectus ea enim iure quod cons', '960x0.jpg'),
('Triya', 'Triya', 'Sahadeo Lall', 'Female', 22, 'Lets play some games...mind games', 'wallpaper1.jpg'),
('yasteel', 'Yasteel', 'Gungapursat', 'Male', 22, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia facere magnam, nobis, voluptatibus eveniet ea adipisci nesciunt quod. Similique, do', '17cd4124e87c4b30a5fecf2605d86b6b.png');
