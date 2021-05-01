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
  **** Until everyone has their local sql database setup the same way, MAKE SURE to modify queries for correct table names. Note that when accesing the object, the column/attribute name may differ as well. Current implementation depends on the following sql schema:
    apartments
      apartment_id smallint auto increment primary key
      apt_name varchar(60)
      address varchar(80) not null
      lower_price smallint
      upper_price smallint
      phone char(12) default null -> none listed
      email varchar(40) default null -> none listed
      avg_rating float check constraint 0-5 default null -> no reviews
    reviews
      apartment_id smallint foreign key
      user_id int foreign key 
      bedbath enum ...
      upvotes int default 0
      downvotes int default 0
      review_text mediumtext 
      review_num int primary key auto increment
      date timestamp
    users
      user_id int autoincrement primary key
      legal_name varchar(40)
      username varchar(40)
      email varchar(40)
      password varchar(100)
        **** size MUST BE varchar(100) to store the entire hashed version (like 70 ? chars)

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

Before running the server:
  In /server, create a dotenv file (.env) for connecting to the database. In the .env file, assign the following keys based on your machine/info:
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=s1mpl3
    DB_DATABASE=test

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
