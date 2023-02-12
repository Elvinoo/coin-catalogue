create database coinList;
use coinList;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '22Bb9061990';
flush privileges;
create Table coins(
id INT PRIMARY KEY AUTO_INCREMENT,
category VARCHAR(50) NOT NULL,
coinName VARCHAR(50) NOT NULL,
denomination VARCHAR(50) NOT NULL,
year VARCHAR(50) NOT NULL ,
price VARCHAR(50) NOT NULL,
country  VARCHAR(50) NOT NULL,
metal VARCHAR(50) NOT NULL,
shortDesc VARCHAR(200) NOT NULL,
longDesc VARCHAR(1200) NOT NULL,
quality VARCHAR(50) NOT NULL,
weight VARCHAR(30) NOT NULL,
observeLink VARCHAR(100) NOT NULL,
reverseLink VARCHAR(100) NOT NULL,
isRemoved BOOLEAN DEFAULT false
);
create Table user_login(
id INT PRIMARY KEY AUTO_INCREMENT,
userName VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(70) NOT NULL
);
CREATE TABLE user_login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(55) COLLATE utf8mb4_General_ci NOT NULL,
  password VARCHAR(70) NOT NULL,
  UNIQUE (username)
);
select * from user_login;
SELECT * FROM coins;
SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
SELECT * FROM user_login;