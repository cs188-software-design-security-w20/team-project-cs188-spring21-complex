Summary:
Project Complex provides UCLA students with a platform to find, rate, and review Westwood apartments. It allows them to make better-informed decisions before signing their leases. It will be functionally similar to bruinwalk.com, but for places to live instead of courses to take. Project Complex was motivated by the lack of resources and transparency that second-year students encounter when hunting for places to live off-campus.

Built With:
react

nodejs
  express
  express-session
  express-messages
  express-validator
  connect-flash
  passport
  passport-local
  bcryptjs
  mysql

mysql
  CREATE TABLE `apartments` (
   `apt_id` smallint(6) NOT NULL AUTO_INCREMENT,
   `apt_name` varchar(60) NOT NULL,
   `address` varchar(80) NOT NULL,
   `lower_price` smallint(6) NOT NULL,
   `upper_price` smallint(6) NOT NULL,
   `phone` char(12) DEFAULT NULL,
   `email` varchar(40) DEFAULT NULL,
   `avg_rating` float DEFAULT NULL,
   PRIMARY KEY (`apt_id`),
   CONSTRAINT `rating_interval` CHECK (`avg_rating` between 0 and 5)
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

  CREATE TABLE `users` (
   `user_id` int(11) NOT NULL AUTO_INCREMENT,
   `legal_name` varchar(40) NOT NULL,
   `username` varchar(40) NOT NULL,
   `email` varchar(40) NOT NULL,
   `password` varchar(100) NOT NULL,
   PRIMARY KEY (`user_id`),
   UNIQUE KEY `email` (`email`),
   UNIQUE KEY `ucla_id` (`username`)
  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;	

  CREATE TABLE `reviews` (
   `apt_id` smallint(6) NOT NULL,
   `user_id` int(11) NOT NULL,
   `bedbath` enum('1B1B','1B2B','2B1B','2B2B','2B3B','3B1B','3B2B','3B3B','3B4B','4B1B','4B2B','4B3B','4B4B') NOT NULL,
   `upvotes` int(11) NOT NULL DEFAULT 0,
   `downvotes` int(11) NOT NULL DEFAULT 0,
   `review_text` mediumtext NOT NULL,
   `review_num` int(11) NOT NULL AUTO_INCREMENT,
   `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
   PRIMARY KEY (`review_num`) USING BTREE,
   UNIQUE KEY `apartment_id` (`apt_id`) USING BTREE,
   UNIQUE KEY `user_id` (`user_id`) USING BTREE,
   CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
   CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`apt_id`) REFERENCES `apartments` (`apt_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

things to consider:
  apartments >
    amenities/features, possibly community
    date updated
    sqft
  reviews >
    ratings (5 categories?)


Instructions:
If you haven't already (say you just cloned it): for each of the directories (team complex..., client, server), install the node module dependencies.
  cd [dir_path]
  npm install

Set up your local mysql database by copy-pasting this into your command line interface, and modifying the username:
mysql -u username -e "create database complex; use complex; CREATE TABLE `apartments` (`apt_id` smallint(6) NOT NULL AUTO_INCREMENT, `apt_name` varchar(60) NOT NULL, `address` varchar(80) NOT NULL, `lower_price` smallint(6) NOT NULL, `upper_price` smallint(6) NOT NULL, `phone` char(12) DEFAULT NULL, `email` varchar(40) DEFAULT NULL, `avg_rating` float DEFAULT NULL, PRIMARY KEY (`apt_id`), CONSTRAINT `rating_interval` CHECK (`avg_rating` between 0 and 5)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1; CREATE TABLE `users` (`user_id` int(11) NOT NULL AUTO_INCREMENT, `legal_name` varchar(40) NOT NULL, `username` varchar(40) NOT NULL, `email` varchar(40) NOT NULL, `password` varchar(100) NOT NULL, PRIMARY KEY (`user_id`), UNIQUE KEY `email` (`email`), UNIQUE KEY `ucla_id` (`username`) ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1; CREATE TABLE `reviews` (`apt_id` smallint(6) NOT NULL, `user_id` int(11) NOT NULL, `bedbath` enum('1B1B','1B2B','2B1B','2B2B','2B3B','3B1B','3B2B','3B3B','3B4B','4B1B','4B2B','4B3B','4B4B') NOT NULL, `upvotes` int(11) NOT NULL DEFAULT 0, `downvotes` int(11) NOT NULL DEFAULT 0, `review_text` mediumtext NOT NULL, `review_num` int(11) NOT NULL AUTO_INCREMENT, `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), PRIMARY KEY (`review_num`) USING BTREE, UNIQUE KEY `apartment_id` (`apt_id`) USING BTREE, UNIQUE KEY `user_id` (`user_id`) USING BTREE, CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`), CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`apt_id`) REFERENCES `apartments` (`apt_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1; show databases; show tables from complex; show columns from apartments from complex; show columns from reviews from complex; show columns from users from complex;"


Before running the server:
  In /server, create a dotenv file (.env) for connecting to the database. In the .env file, assign the following keys based on your machine/info (database name SHOULD BE 'complex'):
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASS=your_password
    DB_DATABASE=complex

Before running the client:
  -- Insert steps here --

In the terminal (in the root directory), type one of the following (see package.json for more details):
  npm run server
  npm run client 
  npm run dev

Current Security Features:
  During registration, server stores the hashed password in db 
  Based on whether a user is logged in, we can restrict access to pages or page content 
    Ex: viewing their individual profile page, posting a review, editing their review?, upvoting/downvoting 
  All user input can be checked with express-validator 

TODO:

Khang
  Front-end design things
  Retrieving individual apartment data from db to dynamically generate page contents when requested

Chris
  Google Maps Integration
  Search bar
  Scrape for westwood apartment data csv, format, load into csv > populate our db table
    apartments.com ?
  Captcha for posting reviews

Jesse
  CSRF, XSS Prevention
  Image upload & SFW validation
  How to prevent brute force logins

Ryan
  Upon registration, send an email to verify user
  Enforce 2FA setup at registration
  Hosting db online

Ethan
  Sessions & cookies (if i exit window, or if i'm inactive for some time, log me out)  
  Finer detail on user input checking
  Finalize the db schema
    Generate the queries/scripts that'll create each table with the correct apartment data, for everyone
  Hiding features from users who aren't logged in
    Link to their profile, logout, post review, upvote/downvote, upload images
  Connect get/post requests to the correct route for react pages
