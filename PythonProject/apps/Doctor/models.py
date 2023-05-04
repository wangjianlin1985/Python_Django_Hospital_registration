from django.db import models
from apps.Department.models import Department
from apps.SchoolRecord.models import SchoolRecord
from tinymce.models import HTMLField


class Doctor(models.Model):
    doctorNumber = models.CharField(max_length=20, default='', primary_key=True, verbose_name='医生编号')
    password = models.CharField(max_length=20, default='', verbose_name='登陆密码')
    departmentObj = models.ForeignKey(Department,  db_column='departmentObj', on_delete=models.PROTECT, verbose_name='所在科室')
    name = models.CharField(max_length=20, default='', verbose_name='姓名')
    sex = models.CharField(max_length=4, default='', verbose_name='性别')
    age = models.IntegerField(default=0,verbose_name='年龄')
    doctorPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='医生照片')
    schoolRecordObj = models.ForeignKey(SchoolRecord,  db_column='schoolRecordObj', on_delete=models.PROTECT, verbose_name='学历')
    zhicheng = models.CharField(max_length=20, default='', verbose_name='职称')
    inDate = models.CharField(max_length=20, default='', verbose_name='入院日期')
    telphone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    doctorDesc = HTMLField(max_length=8000, verbose_name='医生介绍')

    class Meta:
        db_table = 't_Doctor'
        verbose_name = '医生信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        doctor = {
            'doctorNumber': self.doctorNumber,
            'password': self.password,
            'departmentObj': self.departmentObj.departmentName,
            'departmentObjPri': self.departmentObj.departmentNo,
            'name': self.name,
            'sex': self.sex,
            'age': self.age,
            'doctorPhoto': self.doctorPhoto.url,
            'schoolRecordObj': self.schoolRecordObj.schoolRecordName,
            'schoolRecordObjPri': self.schoolRecordObj.schoolRecordId,
            'zhicheng': self.zhicheng,
            'inDate': self.inDate,
            'telphone': self.telphone,
            'doctorDesc': self.doctorDesc,
        }
        return doctor

