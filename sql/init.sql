-- AI 视频制作 数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS ai_video CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ai_video;

-- 项目表
CREATE TABLE IF NOT EXISTS project (
  uuid VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  type VARCHAR(50) NOT NULL,
  outline LONGTEXT,
  sourceCode LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_createdAt (createdAt),
  INDEX idx_type (type)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 消息表
CREATE TABLE IF NOT EXISTS message (
  id VARCHAR(36) PRIMARY KEY,
  projectUuid VARCHAR(36) NOT NULL,
  role VARCHAR(20) NOT NULL,
  content LONGTEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(projectUuid) REFERENCES project(uuid) ON DELETE CASCADE,
  INDEX idx_projectUuid (projectUuid),
  INDEX idx_createdAt (createdAt)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

