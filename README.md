# Python_Django_Hospital_registration
Pythonj基于Django医院挂号诊疗系统毕业源码案例设计

## 技术环境: PyCharm + Django2.2 + Python3.7 + mysql

（1）登陆：用户可以通过用户名和密码进行登陆系统。
（2）修改资料：医疗可以通过对在个人资料模块进行修改包括密码。
（3）用户：查看科室信息，查看医生信息，查看新闻信息，查看网站留言以及基本的登陆注册功能，我要预约以及我的预约信息，我要留言等功能。
（4）医生：我的病人信息管理模块，预约管理模块，留言列表，能够查看所有的用户留言信息；
（5）系统管理员：科室信息管理，医生信息管理，病人信息管理，预约信息管理，新闻信息管理，留言信息管理，用户信息管理等。

## 实体ER属性：
用户信息: 用户名,密码,姓名,性别,照片,出生日期,身份证,籍贯,联系电话,家庭地址,注册时间

科室信息: 科室编号,科室名称,成立日期,联系电话,负责人,科室介绍

医生信息: 医生编号,登陆密码,所在科室,姓名,性别,年龄,医生照片,学历,职称,入院日期,联系电话,医生介绍

学历信息: 记录编号,学历名称

医生预约: 记录编号,预约用户,预约医生,预约日期,预约时间,联系电话,病情说明,处理状态,医生回复,提交时间

留言: 留言id,留言标题,留言内容,留言人,留言时间,管理回复,回复时间

新闻公告: 公告id,标题,公告内容,发布时间

病人: 病人id,病人姓名,病人性别,身份证号,联系电话,病人病例,医生,登记时间


