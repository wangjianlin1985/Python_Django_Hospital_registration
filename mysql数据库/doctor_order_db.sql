/*
 Navicat Premium Data Transfer

 Source Server         : mysql5.6_20210415
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : doctor_order_db

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 25/04/2021 01:37:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for t_department
-- ----------------------------
DROP TABLE IF EXISTS `t_department`;
CREATE TABLE `t_department`  (
  `departmentNo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'departmentNo',
  `departmentName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '科室名称',
  `madeDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '成立日期',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `chargeMan` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '负责人',
  `departmentDesc` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '科室介绍',
  PRIMARY KEY (`departmentNo`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_department
-- ----------------------------
INSERT INTO `t_department` VALUES ('GDWK', '肝胆外科', '2021-04-01', '13508109834', '李霞', '<p>拥有一批技术经验丰富的医生团队！</p>');
INSERT INTO `t_department` VALUES ('XHNK', '消化内科', '2021-04-07', '13508100834', '王德泉', '<p>主要治疗各种消化疾病</p>');

-- ----------------------------
-- Table structure for t_doctor
-- ----------------------------
DROP TABLE IF EXISTS `t_doctor`;
CREATE TABLE `t_doctor`  (
  `doctorNumber` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'doctorNumber',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登陆密码',
  `departmentObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '所在科室',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `sex` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `age` int(11) NOT NULL COMMENT '年龄',
  `doctorPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生照片',
  `schoolRecordObj` int(11) NOT NULL COMMENT '学历',
  `zhicheng` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '职称',
  `inDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '入院日期',
  `telphone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `doctorDesc` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生介绍',
  PRIMARY KEY (`doctorNumber`) USING BTREE,
  INDEX `departmentObj`(`departmentObj`) USING BTREE,
  INDEX `schoolRecordObj`(`schoolRecordObj`) USING BTREE,
  CONSTRAINT `t_doctor_ibfk_1` FOREIGN KEY (`departmentObj`) REFERENCES `t_department` (`departmentNo`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_doctor_ibfk_2` FOREIGN KEY (`schoolRecordObj`) REFERENCES `t_schoolrecord` (`schoolRecordId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_doctor
-- ----------------------------
INSERT INTO `t_doctor` VALUES ('YS001', '123', 'XHNK', '张小红', '女', 34, 'img/23.jpg', 1, '主治医师', '2021-04-12', '13508103922', '<p>10年工作经验，擅长常见消化疾病的治疗！</p>');
INSERT INTO `t_doctor` VALUES ('YS002', '123', 'XHNK', '李小兔', '女', 23, 'img/12.jpg', 1, '一级专家', '2021-04-13', '13508902934', '<p>临床经验丰富，擅长中西医结合治疗消化疾病！</p>');
INSERT INTO `t_doctor` VALUES ('YS003', '123', 'GDWK', '李明', '男', 62, 'img/yisheng.jpg', 1, '一级专家', '2021-04-06', '13629092342', '<p>30年技术经验，精通肝胆常见疾病治疗，擅长肝脏移植手术！</p>');

-- ----------------------------
-- Table structure for t_doctororder
-- ----------------------------
DROP TABLE IF EXISTS `t_doctororder`;
CREATE TABLE `t_doctororder`  (
  `orderId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `userObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '预约用户',
  `doctorObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '预约医生',
  `orderDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '预约日期',
  `orderTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '预约时间',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `reason` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '病情说明',
  `handState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '处理状态',
  `replyContent` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '医生回复',
  `addTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`orderId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  INDEX `doctorObj`(`doctorObj`) USING BTREE,
  CONSTRAINT `t_doctororder_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_doctororder_ibfk_2` FOREIGN KEY (`doctorObj`) REFERENCES `t_doctor` (`doctorNumber`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_doctororder
-- ----------------------------
INSERT INTO `t_doctororder` VALUES (1, 'user1', 'YS001', '2021-04-13', '上午10点-11点', '13508102934', '我肚子痛', '审核通过', '来检查吧，做胃镜不要吃饭', '2021-04-16 02:12:47');
INSERT INTO `t_doctororder` VALUES (2, 'user2', 'YS002', '2021-04-22', '上午10点-11点', '13508109341', '经常拉肚子', '待审核', '--', '2021-04-19 01:56:10');
INSERT INTO `t_doctororder` VALUES (3, 'user2', 'YS001', '2021-04-15', '上午8点-9点', '333', '胆囊炎估计复发了，痛', '待审核', '--', '2021-04-20 01:53:01');

-- ----------------------------
-- Table structure for t_leaveword
-- ----------------------------
DROP TABLE IF EXISTS `t_leaveword`;
CREATE TABLE `t_leaveword`  (
  `leaveWordId` int(11) NOT NULL AUTO_INCREMENT COMMENT '留言id',
  `leaveTitle` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言标题',
  `leaveContent` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言内容',
  `userObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言人',
  `leaveTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '留言时间',
  `replyContent` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '管理回复',
  `replyTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回复时间',
  PRIMARY KEY (`leaveWordId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_leaveword_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_leaveword
-- ----------------------------
INSERT INTO `t_leaveword` VALUES (1, '肚子不舒服，经常拉肚', '我不知道怎么回事，吃多了就拉稀。。', 'user1', '2021-03-09 02:13:27', '你是胃肠道消化不良', '2021-04-16 02:13:31');
INSERT INTO `t_leaveword` VALUES (2, '最近右下腹痛', '不知道是不是胆囊炎复发了，以前痛过，有胆结石！', 'user2', '2021-04-19 01:22:12', '建议你过来复查个彩超', '2021-04-19 01:27:32');

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `noticeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告id',
  `title` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `content` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告内容',
  `publishDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`noticeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, '医院预约网站成立了', '<p>朋友们如果生病以后可以来这个平台预约你们心仪的医生了！</p>', '2021-04-16 02:13:51');
INSERT INTO `t_notice` VALUES (2, 'aaaaa', '<p>bbbbbbb</p>', '2021-04-25 01:16:11');

-- ----------------------------
-- Table structure for t_patient
-- ----------------------------
DROP TABLE IF EXISTS `t_patient`;
CREATE TABLE `t_patient`  (
  `patientId` int(11) NOT NULL AUTO_INCREMENT COMMENT '病人id',
  `patientName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '病人姓名',
  `sex` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '病人性别',
  `cardNumber` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身份证号',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `illnessCase` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '病人病例',
  `doctorObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生',
  `addTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登记时间',
  PRIMARY KEY (`patientId`) USING BTREE,
  INDEX `doctorObj`(`doctorObj`) USING BTREE,
  CONSTRAINT `t_patient_ibfk_1` FOREIGN KEY (`doctorObj`) REFERENCES `t_doctor` (`doctorNumber`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_patient
-- ----------------------------
INSERT INTO `t_patient` VALUES (1, '黄德全', '男', '513030199209102423', '15903910934', '<p>病人有慢性胃炎，最近又受了风寒，正在中西医结合治疗</p>', 'YS001', '2021-04-16 02:14:26');
INSERT INTO `t_patient` VALUES (2, '杨夏彤', '女', '513030199011202342', '135011903421', '<p>病人得了慢性胆囊炎，需要多喝水，注意休息！</p>', 'YS002', '2021-04-20 01:30:22');

-- ----------------------------
-- Table structure for t_schoolrecord
-- ----------------------------
DROP TABLE IF EXISTS `t_schoolrecord`;
CREATE TABLE `t_schoolrecord`  (
  `schoolRecordId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `schoolRecordName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学历名称',
  PRIMARY KEY (`schoolRecordId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_schoolrecord
-- ----------------------------
INSERT INTO `t_schoolrecord` VALUES (1, '本科');
INSERT INTO `t_schoolrecord` VALUES (2, '专科');
INSERT INTO `t_schoolrecord` VALUES (3, '硕士');
INSERT INTO `t_schoolrecord` VALUES (4, '博士');

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `realName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `sex` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `photo` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '照片',
  `birthday` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `cardNumber` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身份证',
  `city` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '籍贯',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `address` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  `regTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('user1', '123', '张熙桐', '女', 'img/9.jpg', '2021-04-06', '513030199612025083', '四川达州', '13508909834', '四川省达州市渠县', '2021-04-16 02:11:05');
INSERT INTO `t_userinfo` VALUES ('user2', '123', '张琴', '女', 'img/7.jpg', '2021-04-07', '513030199611201293', '四川达州', '13508102342', '成都红星路', '2021-04-19 01:15:03');

SET FOREIGN_KEY_CHECKS = 1;
