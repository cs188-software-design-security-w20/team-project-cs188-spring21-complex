# Description

> Project Complex provides UCLA students with a platform to find, rate, and review Westwood apartments. It allows them to make better-informed decisions before signing their leases. It will be functionally similar to bruinwalk.com, but for places to live instead of courses to take. Project Complex was motivated by the lack of resources and transparency that second-year students encounter when hunting for places to live off-campus.

## Technologies

- React
  - @material-ui/core, @material-ui/icons, @material-ui/lab
  - react, react-dom, react-google-recaptcha, react-icons, react-router, react-router-dom, react-scripts
  - web-vitals, crypto, google-map-react, chokidar
- Node.js
  - express
    - express-session, express-validator, express-fileupload
  - passport
    - passport-local, passport-2fa-totp, passport-totp
  - bcryptjs, mysql, cors, qrcode, speakeasy, aws-sdk, jwt-simple, nodemailer, concurrently, uuid, crypto
- MySQL

## Instructions for Running Locally

First, Node.js must be installed. See: https://nodejs.org/en/

Clone this repository, and install the node module dependencies in **_each of the three paths_**:

- `/`
- `/server`
- `/client`

```
cd [dir_path]
npm install
```

### Before running the server

In `/server`, create a dotenv file `.env` for connecting to the database and session keys. In the `.env` file, assign the following keys (valid until we stop hosting the db on AWS around 6/11/21):

```
DB_HOST='team-complex.c7rp55uyi5yc.us-east-2.rds.amazonaws.com'
DB_USER='www'
DB_PASS='AWSDBTeamComplex21215cejkr'
DB_DATABASE='complex'
DB_PORT='3306'
UPLOAD_DIR='./server/uploads'
GMAIL_USER='teamcomplex.verify'
GMAIL_PASS='xopTo3-toxdej-hivgyq'
JWT_SECRET='tbHmywHd8XjixeszaTjCbHUlQiLwUJkCslfaKUOyhXJXqczeaaFF7YRaEJgJ7C3HyDUzB5FpQJ7cF8Gm6gWNJJcHZNi5pCgRG7VB'
```

### Before running the client

In `/client`, create a dotenv file `.env` for assigning the frontend port. In the `.env` file, assign the following keys (this is because we run server/client concurrently, and it must be on separate ports):

```
PORT=4200
```

If there are compilation issues from running `npm install` in the `/client` directory, and you see errors such as `Module not found... @material-ui/icons/Reorder`, then install them like so:
```
npm install @material-ui/core --save
npm install @material-ui/icons --save
... other modules
```

### Testing Project Complex

In the root directory, type this command into the terminal (see package.json for more details):

```
npm run dev
```

## Current Security Features

- During registration, server stores the hashed password in db
- Access/view control, where users must be logged in to perform certain actions such as:
  - Navigating to their individual profile page, posting a review, upvoting/downvoting other reviews, and/or seeing the buttons to do such actions
- All user input is checked, trimmed, and escaped with express-validator
  - login/registration fields
    - First, last, and username must be between 3-15 characters
    - Email must be registered with UCLA (must end in @g.ucla.edu or @ucla.edu)
    - Password must be 8-15 characters long, contain an uppercase letter, and a number
    - Authentication Code must be 6 characters, all digits
    - Account is timed out for 60sec after submitting 3 incorrect passwords
- User must enroll in Google Authenticator (2FA) upon registration
- User must input 2FA code in order to login and delete account
- User must check their email to verify their account
- Upon login, a 3-minute session is created (if inactive for 3 minutes, user is logged out)
  - The cookie only stores the session ID, and no other user information
  - Server only parses requests that originate from the complex website
  - Unique session ID is randomized upon each server restart
  - Cookie can only be read on http
- All server-client requests contain an anti-CSRF token

## Team Members

`Khang`
`Chris`
`Jesse`
`Ryan`
`Ethan`

## [OPTIONAL] Local MySQL Setup ... outdated as of 5/14/21

If you want (and you have installed MySQL), you can set up your local MySQL database by copy-pasting this command, modifying the username, and entering it into your command line interface. It generates the 3 tables: users, apartments, and reviews. Then, it populates the apartment table with 5 default Westwood apartment complexes.

```
mysql -u username -e "create database if not exists complex; use complex; CREATE TABLE IF NOT EXISTS `users` (`user_id` int(11) NOT NULL AUTO_INCREMENT, `legal_name` varchar(40) NOT NULL, `username` varchar(40) NOT NULL, `email` varchar(40) NOT NULL, `password` varchar(100) NOT NULL, `secretKey` varchar(60) NOT NULL, PRIMARY KEY (`user_id`), UNIQUE KEY `email` (`email`), UNIQUE KEY `username` (`username`)) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1; CREATE TABLE IF NOT EXISTS `apartments` (`apt_id` smallint(6) NOT NULL AUTO_INCREMENT, `apt_name` varchar(60) NOT NULL, `address` varchar(80) NOT NULL, `lower_price` smallint(6) NOT NULL, `upper_price` smallint(6) NOT NULL, `phone` char(12) DEFAULT NULL, `email` varchar(40) DEFAULT NULL, `avg_rating` float DEFAULT NULL, `cleanliness` float DEFAULT NULL, `location` float DEFAULT NULL, `amenities` float DEFAULT NULL, `landlord` float DEFAULT NULL, `noise` float DEFAULT NULL, `latitude` decimal(10,8) NOT NULL, `longitude` decimal(11,8) NOT NULL, PRIMARY KEY (`apt_id`), CONSTRAINT `rating_interval` CHECK (`avg_rating` between 0 and 5)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1; CREATE TABLE IF NOT EXISTS `reviews` (`apt_id` smallint(6) NOT NULL, `user_id` int(11) NOT NULL, `bedbath` enum('1B1B','1B2B','2B1B','2B2B','2B3B','3B1B','3B2B','3B3B','3B4B','4B1B','4B2B','4B3B','4B4B') NOT NULL, `upvotes` int(11) NOT NULL DEFAULT 0, `downvotes` int(11) NOT NULL DEFAULT 0, `review_text` mediumtext NOT NULL, `review_num` int(11) NOT NULL AUTO_INCREMENT, `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), `cleanliness` tinyint(4) DEFAULT NULL, `location` tinyint(4) DEFAULT NULL, `amenities` tinyint(4) DEFAULT NULL, `landlord` tinyint(4) DEFAULT NULL, `noise` tinyint(4) DEFAULT NULL, `image` blob DEFAULT NULL, PRIMARY KEY (`review_num`) USING BTREE, KEY `review_apt_id` (`apt_id`), KEY `review_user_id` (`user_id`), CONSTRAINT `review_apt_id` FOREIGN KEY (`apt_id`) REFERENCES `apartments` (`apt_id`) ON DELETE CASCADE, CONSTRAINT `review_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=latin1; INSERT INTO `apartments` (`apt_id`, `apt_name`, `address`, `lower_price`, `upper_price`, `phone`, `email`, `avg_rating`, `cleanliness`, `location`, `amenities`, `landlord`, `noise`, `latitude`, `longitude`) VALUES ('', 'Gayley + Lindbrook', '1122 Gayley Ave Los Angeles CA 90024', '3300', '6495', '844-401-1917','','','','','','','', '34.05995798', '-118.44560180'); INSERT INTO `apartments` (`apt_id`, `apt_name`, `address`, `lower_price`, `upper_price`, `phone`, `email`, `avg_rating`, `cleanliness`, `location`, `amenities`, `landlord`, `noise`, `latitude`, `longitude`) VALUES ('', 'Legacy at Westwood Apartments', '10833 Wilshire Blvd Los Angeles CA 90024', '3503', '6212', '310-425-3967', '', '', '', '', '', '', '', '34.06018556', '-118.44087270'); INSERT INTO `apartments` (`apt_id`, `apt_name`, `address`, `lower_price`, `upper_price`, `phone`, `email`, `avg_rating`, `cleanliness`, `location`, `amenities`, `landlord`, `noise`, `latitude`, `longitude`) VALUES ('', 'The Plaza Apartments', '10983-10983 Wellworth Ave Los Angeles CA 90024', '2300', '4175', '844-356-1728', '', '', '', '', '', '', '', '34.05672944', '-118.44570690'); INSERT INTO `apartments` (`apt_id`, `apt_name`, `address`, `lower_price`, `upper_price`, `phone`, `email`, `avg_rating`, `cleanliness`, `location`, `amenities`, `landlord`, `noise`, `latitude`, `longitude`) VALUES ('', 'The Glendon', '1040 Glendon Ave Los Angeles CA 90024', '3095', '4995', '424-269-6016', '', '', '', '', '', '', '', '34.06163316', '-118.44415930'); INSERT INTO `apartments` (`apt_id`, `apt_name`, `address`, `lower_price`, `upper_price`, `phone`, `email`, `avg_rating`, `cleanliness`, `location`, `amenities`, `landlord`, `noise`, `latitude`, `longitude`) VALUES ('', 'Wilshire Margot Westwood Apartments', '10599 Wilshire Blvd Los Angeles CA 90024', '1345', '3995', '844-538-7419', '', '', '', '', '', '', '', '34.06249792', '-118.43349360'); show tables from complex; show columns from apartments from complex; show columns from reviews from complex; show columns from users from complex;"
```
