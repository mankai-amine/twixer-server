CREATE DATABASE  IF NOT EXISTS `defaultdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `defaultdb`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: twixer-twixer.l.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '9ca9e547-921a-11ef-88ab-02d376ebea81:1-944';

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20241029032206-add-is_deleted-to-replies.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `follower_id` int NOT NULL,
  `followee_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `follower_id` (`follower_id`),
  KEY `followee_id` (`followee_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followee_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `follows_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (2,5,4,NULL),(3,5,1,NULL),(4,4,5,NULL),(5,7,5,NULL),(6,7,4,NULL),(7,7,1,NULL),(8,4,1,NULL),(9,4,7,NULL),(10,1,5,NULL),(11,1,7,NULL),(12,16,1,NULL),(13,16,4,NULL),(14,16,5,NULL),(15,13,16,NULL),(16,13,4,NULL),(20,4,13,NULL),(21,17,4,NULL),(22,17,13,NULL);
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `reply_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `reply_id` (`reply_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`reply_id`) REFERENCES `replies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (13,14,NULL,4),(15,15,NULL,7),(16,14,NULL,7),(17,4,NULL,4),(21,18,NULL,5),(74,1,NULL,5),(124,17,NULL,7),(149,3,NULL,5),(182,4,NULL,5),(226,14,NULL,1),(227,15,NULL,4),(229,6,NULL,7),(232,1,NULL,1),(233,42,NULL,1),(234,4,NULL,1),(235,50,NULL,1),(236,6,NULL,5),(237,50,NULL,5),(238,60,NULL,16),(239,3,NULL,16),(240,63,NULL,16),(242,66,NULL,4),(243,NULL,NULL,4),(245,NULL,NULL,1),(246,66,NULL,1),(247,70,NULL,1),(248,15,NULL,1),(249,71,NULL,4),(250,50,NULL,4),(251,72,NULL,16),(252,3,NULL,13),(258,72,NULL,9),(260,75,NULL,4),(261,76,NULL,17),(262,77,NULL,17);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `date` datetime NOT NULL,
  `content` varchar(560) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `orig_post_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `orig_post_id` (`orig_post_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`orig_post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'2024-10-29 20:34:38','Is anyone else out there?!',0,NULL),(2,5,'2024-10-30 16:36:26','This post was deleted',1,NULL),(3,5,'2024-10-30 20:44:20','I love coding in Node and React',0,NULL),(4,4,'2024-10-30 21:45:09','hello world, it is me!',0,NULL),(5,5,'2024-10-31 01:56:53','This post was deleted',1,NULL),(6,4,'2024-10-31 13:16:35','Wow I love coding!',0,NULL),(7,5,'2024-10-31 14:33:36','This post was deleted',1,NULL),(8,4,'2024-10-31 20:31:42','This post was deleted',1,NULL),(9,5,'2024-11-01 16:51:38','This post was deleted',1,NULL),(10,5,'2024-11-01 16:51:38','This post was deleted',1,NULL),(11,5,'2024-11-01 16:51:56','This post was deleted',1,NULL),(12,5,'2024-11-01 17:03:15','This post was deleted',1,NULL),(13,5,'2024-11-01 17:08:49','This post was deleted',1,NULL),(14,7,'2024-11-01 19:46:49','I AM THE ADMIN!!!!!!',0,NULL),(15,7,'2024-11-01 20:16:12','another test post',0,NULL),(16,4,'2024-11-02 01:40:17','This post was deleted',1,NULL),(17,4,'2024-11-02 02:05:30','This post was deleted',1,NULL),(18,5,'2024-11-02 15:06:22','This post was deleted',1,NULL),(19,5,'2024-11-02 15:10:36','This post was deleted',1,NULL),(20,5,'2024-11-02 15:18:36','This post was deleted',1,NULL),(21,5,'2024-11-02 15:19:54','This post was deleted',1,NULL),(22,5,'2024-11-02 15:23:41','This post was deleted',1,NULL),(23,5,'2024-11-02 15:24:18','This post was deleted',1,NULL),(24,5,'2024-11-02 17:24:05','This post was deleted',1,NULL),(25,4,'2024-11-02 23:55:46','This post was deleted',1,NULL),(41,1,'2024-11-03 20:17:09','This post was deleted',1,NULL),(42,1,'2024-11-03 20:22:23','Test post #2 for deletion',0,NULL),(50,1,'2024-11-03 22:30:46','Geese are dangerous',0,NULL),(51,5,'2024-11-04 00:07:47','This post was deleted',1,NULL),(60,5,'2024-11-04 00:58:35','Geese are dangerous',0,50),(61,4,'2024-11-04 01:07:42','This post was deleted',1,42),(62,4,'2024-11-04 01:26:40','Geese are dangerous',0,60),(63,16,'2024-11-04 01:40:44','I love coding in Node and React',0,3),(64,16,'2024-11-04 01:41:38','This post was deleted',1,60),(65,4,'2024-11-04 01:43:55','Geese are dangerous',0,64),(66,4,'2024-11-04 02:00:53','Woooooo! Posting!',0,NULL),(70,13,'2024-11-04 03:10:53','This stuff is incredible',0,NULL),(71,1,'2024-11-04 04:44:37','This stuff is incredible',0,70),(72,4,'2024-11-04 13:02:46','The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly but gets faster each minute after you hear this signal.',0,NULL),(75,4,'2024-11-04 13:50:47','This stuff is incredible',0,70),(76,17,'2024-11-04 14:13:53','This post was deleted',1,NULL),(77,17,'2024-11-04 14:14:32','This post was deleted',1,72);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `replies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `date` datetime NOT NULL,
  `user_id` int NOT NULL,
  `content` varchar(280) NOT NULL,
  `orig_reply_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `orig_reply_id` (`orig_reply_id`),
  CONSTRAINT `replies_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `replies_ibfk_3` FOREIGN KEY (`orig_reply_id`) REFERENCES `replies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `replies`
--

LOCK TABLES `replies` WRITE;
/*!40000 ALTER TABLE `replies` DISABLE KEYS */;
INSERT INTO `replies` VALUES (1,1,'2024-11-01 19:40:15',1,'I\'m here!',NULL,0),(2,1,'2024-11-01 20:37:03',1,'I like replying to my own posts.',NULL,0),(3,14,'2024-11-01 20:37:49',1,'all hail the admin',NULL,0),(4,1,'2024-11-01 21:09:54',1,'Will the page refetch on submit?',NULL,0),(5,1,'2024-11-01 21:09:56',1,'This reply was deleted',NULL,0),(6,14,'2024-11-01 23:20:12',4,'admin!',NULL,0),(7,4,'2024-11-02 01:42:33',4,'few its working!',NULL,0),(8,14,'2024-11-02 01:43:37',4,'i dislike you',NULL,0),(9,41,'2024-11-03 20:17:32',1,'Let\'s delete this comment!',NULL,0),(10,42,'2024-11-03 20:22:51',1,'This reply was deleted',NULL,1),(11,42,'2024-11-03 21:46:17',1,'this comment is not deleted',NULL,0),(12,50,'2024-11-03 22:31:05',1,'Agreed.',NULL,0),(13,50,'2024-11-03 22:31:22',1,'This reply was deleted',NULL,1),(14,50,'2024-11-03 22:37:11',1,'This reply was deleted',NULL,1),(15,51,'2024-11-04 00:08:00',5,'This reply was deleted',NULL,1),(16,50,'2024-11-04 00:09:15',5,'This reply was deleted',NULL,1),(17,50,'2024-11-04 00:09:45',5,'This reply was deleted',NULL,1),(18,42,'2024-11-04 00:15:39',5,'This reply was deleted',NULL,1),(19,14,'2024-11-04 00:16:49',7,'This reply was deleted',NULL,1),(20,50,'2024-11-04 00:17:43',7,'This reply was deleted',NULL,1),(21,6,'2024-11-04 00:18:06',5,'This reply was deleted',NULL,1),(22,6,'2024-11-04 00:18:49',5,'This reply was deleted',NULL,1),(23,60,'2024-11-04 01:39:55',16,'honk!',NULL,0),(24,63,'2024-11-04 01:41:00',16,'it\'s a blast!',NULL,0),(25,65,'2024-11-04 01:44:53',4,'indeed!',NULL,0),(27,66,'2024-11-04 02:16:42',5,'This reply was deleted',NULL,1),(28,66,'2024-11-04 02:16:49',5,'This reply was deleted',NULL,1),(29,63,'2024-11-04 02:17:22',5,'Nice !',NULL,0),(30,50,'2024-11-04 02:18:27',5,'This reply was deleted',NULL,1),(31,66,'2024-11-04 02:22:12',13,'This reply was deleted',NULL,1),(32,63,'2024-11-04 02:24:14',13,'This reply was deleted',NULL,1),(33,4,'2024-11-04 02:25:35',13,'Hi !',NULL,0),(34,50,'2024-11-04 02:28:45',5,'Ok !',NULL,0),(36,66,'2024-11-04 02:30:56',5,'Ok !',NULL,0),(37,66,'2024-11-04 02:31:53',4,'This reply was deleted',NULL,1),(38,42,'2024-11-04 02:32:53',5,'Ok !',NULL,0),(40,66,'2024-11-04 02:33:55',4,'This reply was deleted',NULL,1),(41,42,'2024-11-04 02:51:49',16,'This reply was deleted',NULL,1),(42,42,'2024-11-04 02:51:56',16,'This reply was deleted',NULL,1),(43,42,'2024-11-04 02:52:00',16,'This reply was deleted',NULL,1),(44,42,'2024-11-04 02:52:41',16,'This reply was deleted',NULL,1),(45,42,'2024-11-04 02:52:52',16,'This reply was deleted',NULL,1),(46,42,'2024-11-04 02:52:55',16,'This reply was deleted',NULL,1),(47,42,'2024-11-04 02:52:57',16,'This reply was deleted',NULL,1),(48,42,'2024-11-04 02:53:29',16,'This reply was deleted',NULL,1),(49,42,'2024-11-04 02:53:42',16,'This reply was deleted',NULL,1),(50,42,'2024-11-04 03:01:22',16,'This reply was deleted',NULL,1),(51,42,'2024-11-04 03:01:41',16,'This reply was deleted',NULL,1),(52,42,'2024-11-04 03:01:45',16,'This reply was deleted',NULL,1),(53,42,'2024-11-04 03:02:11',16,'test',NULL,0),(54,50,'2024-11-04 03:07:34',16,'This reply was deleted',NULL,1),(55,50,'2024-11-04 03:07:37',16,'This reply was deleted',NULL,1),(56,50,'2024-11-04 03:07:39',16,'This reply was deleted',NULL,1),(57,50,'2024-11-04 03:08:06',16,'This reply was deleted',NULL,1),(58,50,'2024-11-04 03:08:08',16,'This reply was deleted',NULL,1),(59,50,'2024-11-04 03:08:09',16,'This reply was deleted',NULL,1),(60,66,'2024-11-04 03:08:51',13,'This reply was deleted',NULL,1),(61,63,'2024-11-04 03:09:22',13,'This reply was deleted',NULL,1),(62,70,'2024-11-04 03:11:10',13,'This reply was deleted',NULL,1),(63,70,'2024-11-04 03:11:16',13,'This reply was deleted',NULL,1),(64,50,'2024-11-04 03:13:23',16,'This reply was deleted',NULL,1),(65,50,'2024-11-04 03:13:27',16,'This reply was deleted',NULL,1),(66,50,'2024-11-04 03:13:31',16,'This reply was deleted',NULL,1),(67,50,'2024-11-04 03:13:45',16,'This reply was deleted',NULL,1),(68,50,'2024-11-04 03:13:50',16,'This reply was deleted',NULL,1),(69,50,'2024-11-04 03:13:51',16,'This reply was deleted',NULL,1),(70,50,'2024-11-04 03:13:56',16,'This reply was deleted',NULL,1),(71,50,'2024-11-04 03:14:06',16,'This reply was deleted',NULL,1),(72,50,'2024-11-04 03:14:26',16,'honkhonkhonk',NULL,0),(73,50,'2024-11-04 03:14:27',16,'This reply was deleted',NULL,1),(74,50,'2024-11-04 03:14:29',16,'This reply was deleted',NULL,1),(75,50,'2024-11-04 03:14:37',16,'This reply was deleted',NULL,1),(76,50,'2024-11-04 03:20:36',16,'This reply was deleted',NULL,1),(77,50,'2024-11-04 03:20:41',16,'This reply was deleted',NULL,1),(78,50,'2024-11-04 03:21:30',16,'This reply was deleted',NULL,1),(79,50,'2024-11-04 03:21:55',16,'honkhonkhonk',NULL,0),(80,50,'2024-11-04 03:22:03',16,'This reply was deleted',NULL,1),(81,50,'2024-11-04 03:24:02',16,'honk',NULL,0),(82,70,'2024-11-04 03:31:15',13,'This reply was deleted',NULL,1),(83,70,'2024-11-04 03:31:19',13,'This reply was deleted',NULL,1),(84,70,'2024-11-04 03:37:11',13,'This reply was deleted',NULL,1),(85,66,'2024-11-04 03:52:07',13,'This reply was deleted',NULL,1),(86,50,'2024-11-04 03:52:30',13,'This reply was deleted',NULL,1),(87,66,'2024-11-04 04:04:27',13,'This reply was deleted',NULL,1),(88,70,'2024-11-04 04:06:43',13,'This reply was deleted',NULL,1),(89,50,'2024-11-04 04:07:07',13,'This reply was deleted',NULL,1),(90,63,'2024-11-04 04:15:36',13,'This reply was deleted',NULL,1),(91,50,'2024-11-04 04:30:20',1,'G',NULL,0),(92,50,'2024-11-04 04:30:51',1,'gooseymcgoose',NULL,0),(93,3,'2024-11-04 04:42:20',1,'Node and React are the best!',NULL,0),(94,70,'2024-11-04 04:42:34',1,'This reply was deleted',NULL,1),(95,66,'2024-11-04 04:44:15',13,'This reply was deleted',NULL,1),(96,6,'2024-11-04 04:44:31',13,'This reply was deleted',NULL,1),(97,71,'2024-11-04 12:41:39',4,'comments!',NULL,0),(98,72,'2024-11-04 13:07:31',16,'My blood is already pumping!',NULL,0),(99,75,'2024-11-04 13:50:58',4,'wow!',NULL,0),(100,76,'2024-11-04 14:14:08',17,'This reply was deleted',NULL,1),(101,77,'2024-11-04 14:14:45',17,'This reply was deleted',NULL,1);
/*!40000 ALTER TABLE `replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` enum('user','premium_user','admin') NOT NULL DEFAULT 'user',
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `bio` varchar(160) DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `account_status` enum('active','unverified','banned') NOT NULL DEFAULT 'active',
  `profile_pic` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','sean@email.com','seano','$2b$10$4PmAOr6AE6KxVujEcbtzc.d1gx997u9iZZwVIWrm07vWkc2eluzTO','I like posting my thoughts.','2024-10-29 15:03:02','active',NULL),(2,'user','sean2@email.com','sean2','$2b$10$clIgnZxDmqIFkUIOta65Qejvz8Yr72eiMTXhdxcmi7lFTVPg7EYLi',NULL,'2024-10-29 15:46:31','active',NULL),(3,'user','test@email.com','testuser','$2b$10$hHSnqqLAdJ6vYSUw2vANK.Lz11K69R3Iic9O/scdD4qIWJw9z1T52',NULL,'2024-10-29 15:59:57','active',NULL),(4,'user','michael@mail.com','michael','$2b$10$MBobCXPlAONo/BimRco5oO1QAESLUX/apf8kqMhx4rne6vKFI0afu','Hey there my name is Michael','2024-10-29 16:02:08','active','https://twixer.s3.us-east-1.amazonaws.com/profile-pictures/54c3fbe4-a4e2-4d06-a4b7-d7c3fc3ef639-reactface.png.jpg'),(5,'user','amine@mail.com','amineM','$2b$10$ucrVQoTm.5cBKgGwMzD6ReDInjqHs6MdVSeQbQ8iX/T10gC83ywOy','Full stack developer living in Montreal','2024-10-29 16:04:54','active','https://twixer.s3.us-east-1.amazonaws.com/profile-pictures/d2e61903-6089-4a31-a497-47c4e67fc502-avatar.jpg.jpg'),(6,'user','newuser@email.com','newUser','$2b$10$QoG5ZUYPDsQpaeSHNQNKCOfQQu7jHPqOMt1hFdlam6xXPDS4gYTN6',NULL,'2024-10-29 18:17:45','active',NULL),(7,'admin','admin@mail.com','ADMIN','$2b$10$XiDINr0RCpv4LiS8BGa/6.WkXMXsBeVRbMv5y/X6YmgtKTxI.OoWG','I am the FIRST admin!','2024-10-30 20:01:23','active','https://twixer.s3.us-east-1.amazonaws.com/profile-pictures/a2c165d4-e963-4b16-8de9-e153c0aad865-4 dabloons.webp.jpg'),(8,'user','amine2@mail.com','amine2','$2b$10$dHM.RiytxRAw/gql9T32E.za0/siAUd63YYytwv7itdF2wiY6F4gm',NULL,'2024-10-30 21:49:50','active',NULL),(9,'user','michael2@mail.com','michael2','$2b$10$KYB1WwacD5ROEvQ06OeWf.qkQcrIHRKisLFuzPGTWmGrAFWGZzdEm',NULL,'2024-10-31 02:39:16','active',NULL),(10,'user','test21@mail.com','testuser21','$2b$10$e/bYvPIrP9s9ND2g0Vd5O.2YuOjWnsDFGlXhHQIbhhTag3P8BQivW',NULL,'2024-10-31 14:22:10','active',NULL),(11,'user','amUser@mail.com','amUser','$2b$10$67lGLqZ94pQ9UhYwYgsSk.WOxYmPLKLWCFkmfq1ZYJeV0cEBgeFnm',NULL,'2024-10-31 15:31:38','active',NULL),(12,'user','banned@mail.com','USER TO BAN','$2b$10$Mg5HgomhKRJuigcUr5xgDuiwPHLU1WoxwTgpiLIxQ/GYKEo0MQ.Sm',NULL,'2024-11-03 17:30:13','banned',NULL),(13,'user','lastuser@mail.com','lastuser','$2b$10$pOsFzHYpN4Dk/buzzscyAOCf0hRH.eGwoHytyZEg7njdqq1/MjS76',NULL,'2024-11-03 17:32:47','active',NULL),(14,'user','banner@mail.com','anotherban','$2b$10$9xQC5nA.NLi5jdniVynaK.RNK8vdD54E14fcGMVNlUrVGuZhXf/T6',NULL,'2024-11-03 17:38:29','banned',NULL),(15,'user','tester@mail.com','testusernew','$2b$10$9yBif/Kx4uoKDNxIqEDaBe4C1RF9k27fmZlxEPbBSmPwFDEoqQg5O',NULL,'2024-11-03 17:49:15','active',NULL),(16,'user','seano2@email.com','seano2','$2b$10$yBRzuBnMHxCoYGDFpFhFS.FJ1BtW/zf.Fws.l5vDv7pJFAOZrhmKq','Honkin\' mad for coding','2024-11-04 00:29:12','active','https://twixer.s3.us-east-1.amazonaws.com/profile-pictures/a49b9b66-ec9a-4c07-85a6-02d0dd96374c-a goose.png.jpg'),(17,'user','bobmail@email.com','newuserBob','$2b$10$1zZROGVAhFJM8DljKTJzN.PzrDKRob5WuzGJ5m2GWyJlaQufaOYmW','My name is bob.','2024-11-04 14:13:03','active','https://twixer.s3.us-east-1.amazonaws.com/profile-pictures/ac965d2d-2c19-4aa2-a826-f3c193ee0117-bobcat.jpg.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-04 12:39:27
