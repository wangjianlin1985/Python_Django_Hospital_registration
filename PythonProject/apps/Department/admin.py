from django.contrib import admin
from apps.Department.models import Department

# Register your models here.

admin.site.register(Department,admin.ModelAdmin)