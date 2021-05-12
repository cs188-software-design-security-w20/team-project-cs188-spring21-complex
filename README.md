# Summary
> Project Complex provides UCLA students with a platform to find, rate, and review Westwood apartments. It allows them to make better-informed decisions before signing their leases. It will be functionally similar to bruinwalk.com, but for places to live instead of courses to take. Project Complex was motivated by the lack of resources and transparency that second-year students encounter when hunting for places to live off-campus.

## Technologies
* React
  * material-ui/core, material-ui/icons
  * react, react-dom, react-router, react-router-dom, react-scripts
  * web-vitals
* Node.js
  * express
    * express-session, express-messages, express-validator, express-fileupload
  * connect-flash
  * passport
    * passport-local, passport-2fa-totp, passport-totp
  * bcryptjs
  * mysql
  * cors
  * qrcode
  * speakeasy
* MySQL

## Potential Considerations
```
apartments >
  amenities/features, possibly community
  date updated
  sqft
reviews >
  ratings (5 categories?)
```

## Instructions
Clone this repository, and install the node module dependencies in **_each of the three paths_**:
* `/`
* `/server`
* `/client`
```
cd [dir_path]
npm install
```
Set up your local MySQL database by copy-pasting this command, modifying the username, and entering it into your command line interface.
```
mysql -u username -e "create database if not exists complex; use complex; CREATE TABLE IF NOT EXISTS `users` (`user_id` int(11) NOT NULL AUTO_INCREMENT, `legal_name` varchar(40) NOT NULL, `username` varchar(40) NOT NULL, `email` varchar(40) NOT NULL, `password` varchar(100) NOT NULL, `secret_key` varchar(60) NOT NULL, PRIMARY KEY (`user_id`), UNIQUE KEY `email` (`email`), UNIQUE KEY `username` (`username`)) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1; CREATE TABLE IF NOT EXISTS `apartments` (`apt_id` smallint(6) NOT NULL AUTO_INCREMENT, `apt_name` varchar(60) NOT NULL, `address` varchar(80) NOT NULL, `lower_price` smallint(6) NOT NULL, `upper_price` smallint(6) NOT NULL, `phone` char(12) DEFAULT NULL, `email` varchar(40) DEFAULT NULL, `avg_rating` float DEFAULT NULL, `cleanliness` float DEFAULT NULL, `location` float DEFAULT NULL, `amenities` float DEFAULT NULL, `landlord` float DEFAULT NULL, `sounds` float DEFAULT NULL, PRIMARY KEY (`apt_id`), CONSTRAINT `rating_interval` CHECK (`avg_rating` between 0 and 5)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1; CREATE TABLE IF NOT EXISTS `reviews` (`apt_id` smallint(6) NOT NULL, `user_id` int(11) NOT NULL, `bedbath` enum('1B1B','1B2B','2B1B','2B2B','2B3B','3B1B','3B2B','3B3B','3B4B','4B1B','4B2B','4B3B','4B4B') NOT NULL, `upvotes` int(11) NOT NULL DEFAULT 0, `downvotes` int(11) NOT NULL DEFAULT 0, `review_text` mediumtext NOT NULL, `review_num` int(11) NOT NULL AUTO_INCREMENT, `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), `cleanliness` float DEFAULT NULL, `location` float DEFAULT NULL, `amenities` float DEFAULT NULL, `landlord` float DEFAULT NULL, `sounds` float DEFAULT NULL, `image` blob NOT NULL, PRIMARY KEY (`review_num`) USING BTREE, KEY `review_apt_id` (`apt_id`), KEY `review_user_id` (`user_id`), CONSTRAINT `review_apt_id` FOREIGN KEY (`apt_id`) REFERENCES `apartments` (`apt_id`) ON DELETE CASCADE, CONSTRAINT `review_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=latin1; show tables from complex; show columns from apartments from complex; show columns from reviews from complex; show columns from users from complex;"
```

### Before running the server
In `/server`, create a dotenv file `.env` for connecting to the database and session keys. In the `.env` file, assign the following keys:
```
DB_HOST='team-complex.c7rp55uyi5yc.us-east-2.rds.amazonaws.com'
DB_USER='www'
DB_PASS='AWSDBTeamComplex21215cejkr'
DB_DATABASE='complex'
DB_PORT='3306'
UPLOAD_DIR='./upload'
```

### Before running the client
In `/client`, create a dotenv file `.env` for assigning the frontend port. In the `.env` file, assign the following keys:
```
PORT=4200
```
If there are compilation issues from running `npm install`, and you see `Module not found... @material-ui/icons/Reorder`, then type in the terminal:
```
npm install @material-ui/core --save
npm install @material-ui/icons --save
```


### Testing Project Complex
In the terminal for the root directory, type one of the following (see package.json for more details):
```
npm run server
npm run client 
npm run dev
```

## Current Security Features
* During registration, server stores the hashed password in db 
* Access/view control, where users must be logged in to perform certain actions such as: 
  * Navigating to their individual profile page, posting a review, editing their review, upvoting/downvoting other reviews, and/or seeing the buttons to do such actions
* All user input is checked, trimmed, and escaped with express-validator
  * login/registration fields
    * First, last, and username must be between 3-15 characters
    * Email must be registered with UCLA (must end in @g.ucla.edu or @ucla.edu)
    * Password must be 8-15 characters long, contain an uppercase letter, and a number
* User must enroll in Google Authenticator (2FA) upon registration
* Upon login, a 15-minute session is created (if inactive for 15 minutes, user is logged out)
  * The cookie only stores the session ID, and no other user information 
  * Server only parses requests that originate from the complex website
  * Unique session ID is randomized upon each server restart ???
  * Cookie can only be read on http

## TODO

`Khang`
* Front-end design things
* Retrieving individual apartment data from db to dynamically generate page contents when requested

`Chris`
* Google Maps Integration
* Search bar
* Scrape for westwood apartment data csv, format, load into csv > populate our db table (apartments.com ?)
* Captcha for posting reviews

`Jesse`
* CSRF, XSS Prevention
* Image upload
* Image validation
* How to prevent brute force logins

`Ryan`
* Upon registration, send an email to verify user
* Enforce 2FA setup at registration
* Hosting db online at AWS
* Hosting the web app on AWS

`Ethan`
* Sessions & cookies (if i exit window, or if i'm inactive for some time, log me out)
* Finer detail on user input checking
* Finalize the db schema
  * Generate the queries/scripts that'll create each table with the correct apartment data, for everyone
* Hiding features from users who aren't logged in
  * Link to their profile, logout, post review, upvote/downvote, upload images
* Connect get/post requests to the correct route for react pages
* Preventing consecutive login > login, login > registration
* Deleting user account
