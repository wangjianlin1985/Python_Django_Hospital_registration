from django.db import models


class SchoolRecord(models.Model):
    schoolRecordId = models.AutoField(primary_key=True, verbose_name='记录编号')
    schoolRecordName = models.CharField(max_length=20, default='', verbose_name='学历名称')

    class Meta:
        db_table = 't_SchoolRecord'
        verbose_name = '学历信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        schoolRecord = {
            'schoolRecordId': self.schoolRecordId,
            'schoolRecordName': self.schoolRecordName,
        }
        return schoolRecord

