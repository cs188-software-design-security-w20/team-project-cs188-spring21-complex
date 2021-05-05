CREATE DATABASE IF NOT EXISTS complex;
USE complex; 
CREATE TABLE IF NOT EXISTS `apartments` (
`apt_id` smallint(6) NOT NULL AUTO_INCREMENT, 
`apt_name` varchar(60) NOT NULL, 
`address` varchar(80) NOT NULL, 
`lower_price` smallint(6) NOT NULL, 
`upper_price` smallint(6) NOT NULL, 
`phone` char(12) DEFAULT NULL, 
`email` varchar(40) DEFAULT NULL, 
`avg_rating` float DEFAULT NULL, 
PRIMARY KEY (`apt_id`), 
CONSTRAINT `rating_interval` CHECK (`avg_rating` between 0 and 5)) 
ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1; 
CREATE TABLE IF NOT EXISTS `users` (
 `user_id` int(11) NOT NULL AUTO_INCREMENT,
 `legal_name` varchar(40) NOT NULL,
 `username` varchar(40) NOT NULL,
 `email` varchar(40) NOT NULL,
 `password` varchar(100) NOT NULL,
 PRIMARY KEY (`user_id`),
 UNIQUE KEY `email` (`email`),
 UNIQUE KEY `ucla_id` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;	
CREATE TABLE IF NOT EXISTS `reviews` (
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
UNIQUE KEY `user_id` (`user_id`) USING BTREE, CONSTRAINT `reviews_ibfk_2` 
FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`), CONSTRAINT `reviews_ibfk_3` 
FOREIGN KEY (`apt_id`) REFERENCES `apartments` (`apt_id`)) 
ENGINE=InnoDB DEFAULT CHARSET=latin1;
show databases; 
show tables from complex; 
show columns from apartments from complex; 
show columns from reviews from complex; 
show columns from users from complex;