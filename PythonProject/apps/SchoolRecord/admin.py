from django.contrib import admin
from apps.SchoolRecord.models import SchoolRecord

# Register your models here.

admin.site.register(SchoolRecord,admin.ModelAdmin)