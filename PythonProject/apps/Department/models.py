from django.db import models
from tinymce.models import HTMLField


class Department(models.Model):
    departmentNo = models.CharField(max_length=20, default='', primary_key=True, verbose_name='科室编号')
    departmentName = models.CharField(max_length=20, default='', verbose_name='科室名称')
    madeDate = models.CharField(max_length=20, default='', verbose_name='成立日期')
    telephone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    chargeMan = models.CharField(max_length=20, default='', verbose_name='负责人')
    departmentDesc = HTMLField(max_length=8000, verbose_name='科室介绍')

    class Meta:
        db_table = 't_Department'
        verbose_name = '科室信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        department = {
            'departmentNo': self.departmentNo,
            'departmentName': self.departmentName,
            'madeDate': self.madeDate,
            'telephone': self.telephone,
            'chargeMan': self.chargeMan,
            'departmentDesc': self.departmentDesc,
        }
        return department

