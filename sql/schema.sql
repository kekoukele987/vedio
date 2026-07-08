-- ============================================
-- AI Video Studio — Database Schema
-- ============================================

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS ai_video
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ai_video;

-- 2. 创建项目表
DROP TABLE IF EXISTS project;
CREATE TABLE project (
  id         BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT  PRIMARY KEY  COMMENT '内部自增ID',
  uuid       CHAR(36)         NOT NULL                               COMMENT 'UUID 公开标识',
  title      VARCHAR(255)     NOT NULL                               COMMENT '项目标题',
  type       ENUM('image','html') NOT NULL                           COMMENT '创作类型：图片轮播 / HTML视频',
  storyboard_outline LONGTEXT NULL                                  COMMENT '完整分镜大纲内容（大文本）',
  video_source       LONGTEXT NULL                                  COMMENT '视频源码（大文本）',
  created_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP     COMMENT '创建时间',
  updated_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  COMMENT '更新时间',

  UNIQUE KEY uk_uuid (uuid),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';
