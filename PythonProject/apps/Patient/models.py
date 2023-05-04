from django.db import models
from apps.Doctor.models import Doctor
from tinymce.models import HTMLField


class Patient(models.Model):
    patientId = models.AutoField(primary_key=True, verbose_name='病人id')
    patientName = models.CharField(max_length=20, default='', verbose_name='病人姓名')
    sex = models.CharField(max_length=4, default='', verbose_name='病人性别')
    cardNumber = models.CharField(max_length=30, default='', verbose_name='身份证号')
    telephone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    illnessCase = HTMLField(max_length=8000, verbose_name='病人病例')
    doctorObj = models.ForeignKey(Doctor,  db_column='doctorObj', on_delete=models.PROTECT, verbose_name='医生')
    addTime = models.CharField(max_length=20, default='', verbose_name='登记时间')

    class Meta:
        db_table = 't_Patient'
        verbose_name = '病人信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        patient = {
            'patientId': self.patientId,
            'patientName': self.patientName,
            'sex': self.sex,
            'cardNumber': self.cardNumber,
            'telephone': self.telephone,
            'illnessCase': self.illnessCase,
            'doctorObj': self.doctorObj.name,
            'doctorObjPri': self.doctorObj.doctorNumber,
            'addTime': self.addTime,
        }
        return patient

