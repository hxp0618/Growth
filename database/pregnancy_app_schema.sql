-- 孕期家庭协作应用数据库设计
-- 数据库: pregnancy_family_app
-- 版本: 1.0
-- 创建时间: 2025-01-04

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `pregnancy_family_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pregnancy_family_app`;

-- ----------------------------
-- 1. 用户相关表
-- ----------------------------

-- 用户基础信息表
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint DEFAULT NULL COMMENT '性别：1-男，2-女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `role_type` enum('pregnant','partner','grandparent','family') NOT NULL COMMENT '角色类型',
  `status` tinyint DEFAULT '1' COMMENT '状态：1-正常，0-禁用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_role_type` (`role_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户基础信息表';

-- 家庭信息表
DROP TABLE IF EXISTS `families`;
CREATE TABLE `families` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '家庭ID',
  `name` varchar(100) NOT NULL COMMENT '家庭名称',
  `creator_id` bigint NOT NULL COMMENT '创建者ID',
  `invite_code` varchar(20) DEFAULT NULL COMMENT '邀请码',
  `status` tinyint DEFAULT '1' COMMENT '状态：1-正常，0-禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invite_code` (`invite_code`),
  KEY `idx_creator_id` (`creator_id`),
  CONSTRAINT `fk_families_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家庭信息表';

-- 家庭成员关系表
DROP TABLE IF EXISTS `family_relations`;
CREATE TABLE `family_relations` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关系ID',
  `family_id` bigint NOT NULL COMMENT '家庭ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role` varchar(20) NOT NULL COMMENT '家庭角色',
  `permissions` json DEFAULT NULL COMMENT '权限配置',
  `invited_by` bigint DEFAULT NULL COMMENT '邀请人ID',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `status` tinyint DEFAULT '1' COMMENT '状态：1-正常，0-已退出',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_family_user` (`family_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_invited_by` (`invited_by`),
  CONSTRAINT `fk_family_relations_family` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`),
  CONSTRAINT `fk_family_relations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_family_relations_inviter` FOREIGN KEY (`invited_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家庭成员关系表';

-- ----------------------------
-- 2. 孕期相关表
-- ----------------------------

-- 孕期信息表
DROP TABLE IF EXISTS `pregnancy_info`;
CREATE TABLE `pregnancy_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '孕期信息ID',
  `user_id` bigint NOT NULL COMMENT '孕妇用户ID',
  `due_date` date NOT NULL COMMENT '预产期',
  `last_menstrual_date` date DEFAULT NULL COMMENT '末次月经日期',
  `current_week` int DEFAULT NULL COMMENT '当前孕周',
  `current_day` int DEFAULT NULL COMMENT '当前孕周天数',
  `pregnancy_status` enum('preparing','pregnant','postpartum') DEFAULT 'pregnant' COMMENT '孕期状态',
  `baby_gender` enum('male','female','unknown') DEFAULT 'unknown' COMMENT '胎儿性别',
  `baby_name` varchar(50) DEFAULT NULL COMMENT '胎儿昵称',
  `pre_pregnancy_weight` decimal(5,2) DEFAULT NULL COMMENT '孕前体重(kg)',
  `target_weight_gain` decimal(5,2) DEFAULT NULL COMMENT '目标体重增长(kg)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_due_date` (`due_date`),
  KEY `idx_pregnancy_status` (`pregnancy_status`),
  CONSTRAINT `fk_pregnancy_info_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='孕期信息表';

-- ----------------------------
-- 3. 健康管理相关表
-- ----------------------------

-- 产检记录表
DROP TABLE IF EXISTS `checkup_records`;
CREATE TABLE `checkup_records` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '产检记录ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `pregnancy_week` int NOT NULL COMMENT '孕周',
  `checkup_date` date NOT NULL COMMENT '产检日期',
  `hospital` varchar(100) DEFAULT NULL COMMENT '医院名称',
  `doctor` varchar(50) DEFAULT NULL COMMENT '医生姓名',
  `checkup_type` varchar(50) DEFAULT NULL COMMENT '检查类型',
  `weight` decimal(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `blood_pressure_high` int DEFAULT NULL COMMENT '收缩压',
  `blood_pressure_low` int DEFAULT NULL COMMENT '舒张压',
  `fundal_height` decimal(4,1) DEFAULT NULL COMMENT '宫高(cm)',
  `abdominal_circumference` decimal(5,1) DEFAULT NULL COMMENT '腹围(cm)',
  `fetal_heart_rate` int DEFAULT NULL COMMENT '胎心率(次/分)',
  `results` json DEFAULT NULL COMMENT '检查结果JSON',
  `attachments` json DEFAULT NULL COMMENT '附件信息JSON',
  `doctor_advice` text DEFAULT NULL COMMENT '医生建议',
  `next_checkup_date` date DEFAULT NULL COMMENT '下次产检日期',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_checkup_date` (`checkup_date`),
  KEY `idx_pregnancy_week` (`pregnancy_week`),
  CONSTRAINT `fk_checkup_records_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产检记录表';

-- 健康数据记录表
DROP TABLE IF EXISTS `health_data`;
CREATE TABLE `health_data` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '健康数据ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `data_type` enum('weight','blood_pressure','fetal_movement','mood','symptom') NOT NULL COMMENT '数据类型',
  `value` json NOT NULL COMMENT '数据值JSON',
  `recorded_date` date NOT NULL COMMENT '记录日期',
  `recorded_time` time DEFAULT NULL COMMENT '记录时间',
  `notes` text DEFAULT NULL COMMENT '备注',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_data_type` (`data_type`),
  KEY `idx_recorded_date` (`recorded_date`),
  CONSTRAINT `fk_health_data_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='健康数据记录表';

-- ----------------------------
-- 4. 营养管理相关表
-- ----------------------------

-- 食物营养数据表
DROP TABLE IF EXISTS `food_nutrition`;
CREATE TABLE `food_nutrition` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '食物ID',
  `food_name` varchar(100) NOT NULL COMMENT '食物名称',
  `category` varchar(50) NOT NULL COMMENT '食物分类',
  `calories_per_100g` decimal(8,2) DEFAULT NULL COMMENT '每100g热量(kcal)',
  `protein_per_100g` decimal(8,2) DEFAULT NULL COMMENT '每100g蛋白质(g)',
  `fat_per_100g` decimal(8,2) DEFAULT NULL COMMENT '每100g脂肪(g)',
  `carbs_per_100g` decimal(8,2) DEFAULT NULL COMMENT '每100g碳水化合物(g)',
  `fiber_per_100g` decimal(8,2) DEFAULT NULL COMMENT '每100g膳食纤维(g)',
  `calcium_mg` decimal(8,2) DEFAULT NULL COMMENT '钙含量(mg/100g)',
  `iron_mg` decimal(8,2) DEFAULT NULL COMMENT '铁含量(mg/100g)',
  `folic_acid_ug` decimal(8,2) DEFAULT NULL COMMENT '叶酸含量(μg/100g)',
  `vitamin_c_mg` decimal(8,2) DEFAULT NULL COMMENT '维生素C含量(mg/100g)',
  `dha_mg` decimal(8,2) DEFAULT NULL COMMENT 'DHA含量(mg/100g)',
  `pregnancy_safe` tinyint DEFAULT '1' COMMENT '孕期安全：1-安全，0-不安全',
  `pregnancy_limit` varchar(200) DEFAULT NULL COMMENT '孕期限制说明',
  `season_available` json DEFAULT NULL COMMENT '应季月份JSON',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_food_name` (`food_name`),
  KEY `idx_category` (`category`),
  KEY `idx_pregnancy_safe` (`pregnancy_safe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='食物营养数据表';

-- 用户饮食记录表
DROP TABLE IF EXISTS `user_diet_records`;
CREATE TABLE `user_diet_records` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '饮食记录ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `food_id` bigint NOT NULL COMMENT '食物ID',
  `amount_grams` decimal(8,2) NOT NULL COMMENT '摄入量(g)',
  `meal_type` enum('breakfast','lunch','dinner','snack') NOT NULL COMMENT '餐次类型',
  `recorded_date` date NOT NULL COMMENT '记录日期',
  `recorded_time` time DEFAULT NULL COMMENT '记录时间',
  `notes` varchar(200) DEFAULT NULL COMMENT '备注',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_food_id` (`food_id`),
  KEY `idx_recorded_date` (`recorded_date`),
  KEY `idx_meal_type` (`meal_type`),
  CONSTRAINT `fk_diet_records_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_diet_records_food` FOREIGN KEY (`food_id`) REFERENCES `food_nutrition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户饮食记录表';

-- 营养目标表
DROP TABLE IF EXISTS `nutrition_targets`;
CREATE TABLE `nutrition_targets` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '营养目标ID',
  `pregnancy_week_start` int NOT NULL COMMENT '孕周开始',
  `pregnancy_week_end` int NOT NULL COMMENT '孕周结束',
  `calories_target` decimal(8,2) NOT NULL COMMENT '热量目标(kcal)',
  `protein_target` decimal(8,2) NOT NULL COMMENT '蛋白质目标(g)',
  `calcium_target` decimal(8,2) NOT NULL COMMENT '钙目标(mg)',
  `iron_target` decimal(8,2) NOT NULL COMMENT '铁目标(mg)',
  `folic_acid_target` decimal(8,2) NOT NULL COMMENT '叶酸目标(μg)',
  `vitamin_c_target` decimal(8,2) NOT NULL COMMENT '维生素C目标(mg)',
  `dha_target` decimal(8,2) DEFAULT NULL COMMENT 'DHA目标(mg)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_pregnancy_week` (`pregnancy_week_start`, `pregnancy_week_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='营养目标表';

-- ----------------------------
-- 5. 家庭协作相关表
-- ----------------------------

-- 任务表
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `family_id` bigint NOT NULL COMMENT '家庭ID',
  `creator_id` bigint NOT NULL COMMENT '创建者ID',
  `assignee_id` bigint DEFAULT NULL COMMENT '执行者ID',
  `title` varchar(200) NOT NULL COMMENT '任务标题',
  `description` text DEFAULT NULL COMMENT '任务描述',
  `category` varchar(50) DEFAULT NULL COMMENT '任务分类',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium' COMMENT '优先级',
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending' COMMENT '任务状态',
  `due_date` datetime DEFAULT NULL COMMENT '截止时间',
  `completed_at` datetime DEFAULT NULL COMMENT '完成时间',
  `completion_photos` json DEFAULT NULL COMMENT '完成照片JSON',
  `rating` tinyint DEFAULT NULL COMMENT '评分(1-5)',
  `feedback` varchar(500) DEFAULT NULL COMMENT '反馈',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_family_id` (`family_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_assignee_id` (`assignee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`),
  CONSTRAINT `fk_tasks_family` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`),
  CONSTRAINT `fk_tasks_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- 通知记录表
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `sender_id` bigint NOT NULL COMMENT '发送者ID',
  `receiver_id` bigint NOT NULL COMMENT '接收者ID',
  `type` varchar(50) NOT NULL COMMENT '通知类型',
  `title` varchar(200) NOT NULL COMMENT '通知标题',
  `content` text NOT NULL COMMENT '通知内容',
  `extra_data` json DEFAULT NULL COMMENT '额外数据JSON',
  `status` enum('sent','read','responded') DEFAULT 'sent' COMMENT '通知状态',
  `read_at` datetime DEFAULT NULL COMMENT '阅读时间',
  `responded_at` datetime DEFAULT NULL COMMENT '响应时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_notifications_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知记录表';

-- ----------------------------
-- 6. 内容和知识相关表
-- ----------------------------

-- 知识内容表
DROP TABLE IF EXISTS `knowledge_content`;
CREATE TABLE `knowledge_content` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '内容ID',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` longtext NOT NULL COMMENT '内容',
  `summary` varchar(500) DEFAULT NULL COMMENT '摘要',
  `category` varchar(50) NOT NULL COMMENT '分类',
  `tags` json DEFAULT NULL COMMENT '标签JSON',
  `target_audience` enum('pregnant','partner','grandparent','all') DEFAULT 'all' COMMENT '目标受众',
  `pregnancy_week_start` int DEFAULT NULL COMMENT '适用孕周开始',
  `pregnancy_week_end` int DEFAULT NULL COMMENT '适用孕周结束',
  `content_type` enum('article','video','audio') DEFAULT 'article' COMMENT '内容类型',
  `media_url` varchar(500) DEFAULT NULL COMMENT '媒体文件URL',
  `duration` int DEFAULT NULL COMMENT '时长(秒)',
  `author` varchar(100) DEFAULT NULL COMMENT '作者',
  `view_count` int DEFAULT '0' COMMENT '浏览次数',
  `like_count` int DEFAULT '0' COMMENT '点赞次数',
  `status` enum('draft','published','archived') DEFAULT 'draft' COMMENT '状态',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_target_audience` (`target_audience`),
  KEY `idx_pregnancy_week` (`pregnancy_week_start`, `pregnancy_week_end`),
  KEY `idx_status` (`status`),
  KEY `idx_published_at` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识内容表';

-- 用户学习记录表
DROP TABLE IF EXISTS `user_learning_records`;
CREATE TABLE `user_learning_records` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '学习记录ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `content_id` bigint NOT NULL COMMENT '内容ID',
  `progress` decimal(5,2) DEFAULT '0.00' COMMENT '学习进度(0-100)',
  `duration` int DEFAULT '0' COMMENT '学习时长(秒)',
  `completed` tinyint DEFAULT '0' COMMENT '是否完成：1-是，0-否',
  `liked` tinyint DEFAULT '0' COMMENT '是否点赞：1-是，0-否',
  `notes` text DEFAULT NULL COMMENT '学习笔记',
  `last_position` int DEFAULT '0' COMMENT '最后播放位置(秒)',
  `completed_at` datetime DEFAULT NULL COMMENT '完成时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_content` (`user_id`, `content_id`),
  KEY `idx_content_id` (`content_id`),
  KEY `idx_completed` (`completed`),
  CONSTRAINT `fk_learning_records_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_learning_records_content` FOREIGN KEY (`content_id`) REFERENCES `knowledge_content` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户学习记录表';

-- ----------------------------
-- 7. 情感互动相关表
-- ----------------------------

-- 心情日记表
DROP TABLE IF EXISTS `mood_diaries`;
CREATE TABLE `mood_diaries` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日记ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `diary_date` date NOT NULL COMMENT '日记日期',
  `mood_score` tinyint NOT NULL COMMENT '心情评分(1-10)',
  `mood_tags` json DEFAULT NULL COMMENT '心情标签JSON',
  `content` text DEFAULT NULL COMMENT '日记内容',
  `photos` json DEFAULT NULL COMMENT '照片JSON',
  `voice_url` varchar(500) DEFAULT NULL COMMENT '语音文件URL',
  `voice_duration` int DEFAULT NULL COMMENT '语音时长(秒)',
  `weather` varchar(50) DEFAULT NULL COMMENT '天气',
  `shared_with_family` tinyint DEFAULT '0' COMMENT '是否分享给家人：1-是，0-否',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`, `diary_date`),
  KEY `idx_diary_date` (`diary_date`),
  KEY `idx_mood_score` (`mood_score`),
  CONSTRAINT `fk_mood_diaries_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='心情日记表';

-- 家庭相册表
DROP TABLE IF EXISTS `family_albums`;
CREATE TABLE `family_albums` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '相册ID',
  `family_id` bigint NOT NULL COMMENT '家庭ID',
  `uploader_id` bigint NOT NULL COMMENT '上传者ID',
  `title` varchar(200) DEFAULT NULL COMMENT '标题',
  `description` text DEFAULT NULL COMMENT '描述',
  `photo_url` varchar(500) NOT NULL COMMENT '照片URL',
  `thumbnail_url` varchar(500) DEFAULT NULL COMMENT '缩略图URL',
  `tags` json DEFAULT NULL COMMENT '标签JSON',
  `pregnancy_week` int DEFAULT NULL COMMENT '孕周',
  `taken_at` datetime DEFAULT NULL COMMENT '拍摄时间',
  `like_count` int DEFAULT '0' COMMENT '点赞数',
  `comment_count` int DEFAULT '0' COMMENT '评论数',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_family_id` (`family_id`),
  KEY `idx_uploader_id` (`uploader_id`),
  KEY `idx_pregnancy_week` (`pregnancy_week`),
  KEY `idx_taken_at` (`taken_at`),
  CONSTRAINT `fk_family_albums_family` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`),
  CONSTRAINT `fk_family_albums_uploader` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家庭相册表';

-- 相册评论表
DROP TABLE IF EXISTS `album_comments`;
CREATE TABLE `album_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `album_id` bigint NOT NULL COMMENT '相册ID',
  `user_id` bigint NOT NULL COMMENT '评论者ID',
  `content` text NOT NULL COMMENT '评论内容',
  `parent_id` bigint DEFAULT NULL COMMENT '父评论ID',
  `like_count` int DEFAULT '0' COMMENT '点赞数',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_album_id` (`album_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_album_comments_album` FOREIGN KEY (`album_id`) REFERENCES `family_albums` (`id`),
  CONSTRAINT `fk_album_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_album_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `album_comments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='相册评论表';

-- ----------------------------
-- 8. 系统配置相关表
-- ----------------------------

-- 系统配置表
DROP TABLE IF EXISTS `system_configs`;
CREATE TABLE `system_configs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text NOT NULL COMMENT '配置值',
  `config_type` enum('string','number','boolean','json') DEFAULT 'string' COMMENT '配置类型',
  `description` varchar(500) DEFAULT NULL COMMENT '配置描述',
  `is_public` tinyint DEFAULT '0' COMMENT '是否公开：1-是，0-否',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 用户设置表
DROP TABLE IF EXISTS `user_settings`;
CREATE TABLE `user_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `setting_key` varchar(100) NOT NULL COMMENT '设置键',
  `setting_value` text NOT NULL COMMENT '设置值',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_setting` (`user_id`, `setting_key`),
  CONSTRAINT `fk_user_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设置表';

-- ----------------------------
-- 9. 初始化数据
-- ----------------------------

-- 插入营养目标数据
INSERT INTO `nutrition_targets` (`pregnancy_week_start`, `pregnancy_week_end`, `calories_target`, `protein_target`, `calcium_target`, `iron_target`, `folic_acid_target`, `vitamin_c_target`, `dha_target`) VALUES
(1, 12, 1800.00, 60.00, 1000.00, 27.00, 600.00, 85.00, 200.00),
(13, 28, 2200.00, 75.00, 1000.00, 27.00, 600.00, 85.00, 200.00),
(29, 40, 2400.00, 85.00, 1200.00, 27.00, 600.00, 120.00, 200.00);

-- 插入基础食物营养数据
INSERT INTO `food_nutrition` (`food_name`, `category`, `calories_per_100g`, `protein_per_100g`, `fat_per_100g`, `carbs_per_100g`, `fiber_per_100g`, `calcium_mg`, `iron_mg`, `folic_
acid_ug`, `vitamin_c_mg`, `pregnancy_safe`, `pregnancy_limit`, `season_available`) VALUES
-- 蔬菜类
('菠菜', '蔬菜', 23.00, 2.90, 0.30, 3.60, 2.20, 99.00, 2.70, 194.00, 32.00, 1, NULL, '[1,2,3,4,11,12]'),
('西兰花', '蔬菜', 34.00, 2.80, 0.40, 7.00, 2.60, 47.00, 0.70, 63.00, 89.20, 1, NULL, '[1,2,3,4,10,11,12]'),
('胡萝卜', '蔬菜', 41.00, 0.90, 0.20, 9.60, 2.80, 33.00, 0.30, 19.00, 5.90, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('西红柿', '蔬菜', 18.00, 0.90, 0.20, 3.90, 1.20, 10.00, 0.30, 15.00, 23.00, 1, NULL, '[6,7,8,9,10]'),

-- 水果类
('苹果', '水果', 52.00, 0.30, 0.20, 14.00, 2.40, 6.00, 0.10, 3.00, 4.60, 1, NULL, '[1,2,3,4,10,11,12]'),
('香蕉', '水果', 89.00, 1.10, 0.30, 23.00, 2.60, 5.00, 0.30, 20.00, 8.70, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('橙子', '水果', 47.00, 0.90, 0.10, 12.00, 2.40, 40.00, 0.10, 40.00, 53.20, 1, NULL, '[1,2,3,4,11,12]'),
('草莓', '水果', 32.00, 0.70, 0.30, 7.70, 2.00, 16.00, 0.40, 24.00, 58.80, 1, '适量食用，注意清洗', '[3,4,5,6]'),
('芒果', '水果', 60.00, 0.80, 0.40, 15.00, 1.60, 11.00, 0.20, 43.00, 36.40, 1, '每日不超过200g', '[4,5,6,7,8,9]'),
('西瓜', '水果', 30.00, 0.60, 0.20, 8.00, 0.40, 7.00, 0.20, 3.00, 8.10, 1, '每日不超过300g，晚上少食', '[6,7,8,9]'),

-- 蛋白质类
('鸡蛋', '蛋类', 155.00, 13.00, 11.00, 1.10, 0.00, 56.00, 2.00, 25.00, 0.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('牛奶', '奶制品', 54.00, 3.00, 3.20, 5.00, 0.00, 104.00, 0.03, 5.00, 1.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('酸奶', '奶制品', 60.00, 3.20, 3.30, 4.70, 0.00, 118.00, 0.05, 7.00, 1.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('三文鱼', '鱼类', 208.00, 25.40, 12.40, 0.00, 0.00, 12.00, 0.80, 26.00, 0.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('瘦猪肉', '肉类', 143.00, 20.30, 6.20, 1.50, 0.00, 6.00, 3.00, 6.00, 0.00, 1, '充分煮熟', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

-- 谷物类
('大米', '谷物', 130.00, 2.70, 0.30, 28.00, 0.40, 25.00, 0.80, 8.00, 0.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('小米', '谷物', 358.00, 9.00, 3.10, 75.10, 1.60, 41.00, 5.10, 19.00, 0.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('燕麦', '谷物', 338.00, 15.00, 8.50, 61.00, 5.30, 186.00, 7.00, 19.00, 0.00, 1, NULL, '[1,2,3,4,5,6,7,8,9,10,11,12]'),

-- 坚果类
('核桃', '坚果', 654.00, 15.20, 65.20, 13.70, 9.50, 56.00, 2.20, 19.00, 1.20, 1, '每日不超过30g', '[1,2,3,4,5,6,7,8,9,10,11,12]'),
('杏仁', '坚果', 579.00, 21.20, 51.40, 22.00, 11.80, 269.00, 3.10, 44.00, 0.00, 1, '每日不超过20g', '[1,2,3,4,5,6,7,8,9,10,11,12]'),

-- 禁忌食物
('生鱼片', '海鲜', 127.00, 20.10, 4.90, 0.00, 0.00, 26.00, 0.40, 5.00, 0.00, 0, '孕期禁食生海鲜', NULL),
('生蚝', '海鲜', 68.00, 9.00, 2.30, 3.90, 0.00, 45.00, 6.20, 12.00, 0.00, 0, '孕期禁食生海鲜', NULL),
('酒精饮品', '饮品', 231.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '孕期严禁饮酒', NULL);

-- 插入系统配置数据
INSERT INTO `system_configs` (`config_key`, `config_value`, `config_type`, `description`, `is_public`) VALUES
('app_name', '家有孕宝', 'string', '应用名称', 1),
('app_version', '1.0.0', 'string', '应用版本', 1),
('pregnancy_weeks', '40', 'number', '标准孕期周数', 1),
('max_family_members', '10', 'number', '最大家庭成员数', 0),
('file_upload_max_size', '10485760', 'number', '文件上传最大大小(字节)', 0),
('notification_push_enabled', 'true', 'boolean', '是否启用推送通知', 0);

SET FOREIGN_KEY_CHECKS = 1;

-- 创建索引优化查询性能
CREATE INDEX idx_users_phone_status ON users(phone, status);
CREATE INDEX idx_pregnancy_info_due_date_status ON pregnancy_info(due_date, pregnancy_status);
CREATE INDEX idx_health_data_user_type_date ON health_data(user_id, data_type, recorded_date);
CREATE INDEX idx_tasks_family_status_due ON tasks(family_id, status, due_date);
CREATE INDEX idx_notifications_receiver_status_created ON notifications(receiver_id, status, created_at);

-- 创建视图简化常用查询
CREATE VIEW v_family_members AS
SELECT 
    fr.family_id,
    fr.user_id,
    u.nickname,
    u.avatar_url,
    u.role_type,
    fr.role as family_role,
    fr.joined_at,
    fr.status
FROM family_relations fr
JOIN users u ON fr.user_id = u.id
WHERE fr.status = 1 AND u.status = 1;

CREATE VIEW v_pregnancy_status AS
SELECT 
    pi.user_id,
    u.nickname,
    pi.due_date,
    pi.current_week,
    pi.current_day,
    pi.pregnancy_status,
    pi.baby_gender,
    pi.baby_name,
    DATEDIFF(pi.due_date, CURDATE()) as days_to_due
FROM pregnancy_info pi
JOIN users u ON pi.user_id = u.id
WHERE u.status = 1;

-- 创建存储过程
DELIMITER //

-- 计算孕周的存储过程
CREATE PROCEDURE CalculatePregnancyWeek(
    IN p_user_id BIGINT,
    OUT p_week INT,
    OUT p_day INT
)
BEGIN
    DECLARE v_due_date DATE;
    DECLARE v_days_pregnant INT;
    
    SELECT due_date INTO v_due_date 
    FROM pregnancy_info 
    WHERE user_id = p_user_id;
    
    IF v_due_date IS NOT NULL THEN
        SET v_days_pregnant = 280 - DATEDIFF(v_due_date, CURDATE());
        SET p_week = FLOOR(v_days_pregnant / 7);
        SET p_day = v_days_pregnant % 7;
        
        -- 更新孕期信息表
        UPDATE pregnancy_info 
        SET current_week = p_week, current_day = p_day, updated_at = NOW()
        WHERE user_id = p_user_id;
    ELSE
        SET p_week = 0;
        SET p_day = 0;
    END IF;
END //

-- 获取营养摄入统计的存储过程
CREATE PROCEDURE GetNutritionStats(
    IN p_user_id BIGINT,
    IN p_date DATE,
    OUT p_calories DECIMAL(10,2),
    OUT p_protein DECIMAL(10,2),
    OUT p_calcium DECIMAL(10,2),
    OUT p_iron DECIMAL(10,2),
    OUT p_folic_acid DECIMAL(10,2)
)
BEGIN
    SELECT 
        COALESCE(SUM(fn.calories_per_100g * udr.amount_grams / 100), 0),
        COALESCE(SUM(fn.protein_per_100g * udr.amount_grams / 100), 0),
        COALESCE(SUM(fn.calcium_mg * udr.amount_grams / 100), 0),
        COALESCE(SUM(fn.iron_mg * udr.amount_grams / 100), 0),
        COALESCE(SUM(fn.folic_acid_ug * udr.amount_grams / 100), 0)
    INTO p_calories, p_protein, p_calcium, p_iron, p_folic_acid
    FROM user_diet_records udr
    JOIN food_nutrition fn ON udr.food_id = fn.id
    WHERE udr.user_id = p_user_id AND udr.recorded_date = p_date;
END //

DELIMITER ;

-- 创建触发器
DELIMITER //

-- 用户创建后自动创建家庭
CREATE TRIGGER tr_users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role_type = 'pregnant' THEN
        INSERT INTO families (name, creator_id, invite_code)
        VALUES (CONCAT(NEW.nickname, '的家庭'), NEW.id, UPPER(SUBSTRING(MD5(CONCAT(NEW.id, NOW())), 1, 8)));
        
        INSERT INTO family_relations (family_id, user_id, role, invited_by, joined_at)
        VALUES (LAST_INSERT_ID(), NEW.id, '孕妇', NEW.id, NOW());
    END IF;
END //

-- 任务状态变更时更新完成时间
CREATE TRIGGER tr_tasks_status_update
BEFORE UPDATE ON tasks
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SET NEW.completed_at = NOW();
    END IF;
END //

-- 通知状态变更时更新时间
CREATE TRIGGER tr_notifications_status_update
BEFORE UPDATE ON notifications
FOR EACH ROW
BEGIN
    IF NEW.status = 'read' AND OLD.status = 'sent' THEN
        SET NEW.read_at = NOW();
    ELSEIF NEW.status = 'responded' AND OLD.status != 'responded' THEN
        SET NEW.responded_at = NOW();
    END IF;
END //

DELIMITER ;

-- 数据库初始化完成
SELECT 'Database schema created successfully!' as message;