from django.db import models


class UserInfo(models.Model):
    user_name = models.CharField(max_length=20, default='', primary_key=True, verbose_name='用户名')
    password = models.CharField(max_length=20, default='', verbose_name='密码')
    realName = models.CharField(max_length=20, default='', verbose_name='姓名')
    sex = models.CharField(max_length=4, default='', verbose_name='性别')
    photo = models.ImageField(upload_to='img', max_length='100', verbose_name='照片')
    birthday = models.CharField(max_length=20, default='', verbose_name='出生日期')
    cardNumber = models.CharField(max_length=20, default='', verbose_name='身份证')
    city = models.CharField(max_length=20, default='', verbose_name='籍贯')
    telephone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    address = models.CharField(max_length=60, default='', verbose_name='家庭地址')
    regTime = models.CharField(max_length=20, default='', verbose_name='注册时间')

    class Meta:
        db_table = 't_UserInfo'
        verbose_name = '用户信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        userInfo = {
            'user_name': self.user_name,
            'password': self.password,
            'realName': self.realName,
            'sex': self.sex,
            'photo': self.photo.url,
            'birthday': self.birthday,
            'cardNumber': self.cardNumber,
            'city': self.city,
            'telephone': self.telephone,
            'address': self.address,
            'regTime': self.regTime,
        }
        return userInfo

