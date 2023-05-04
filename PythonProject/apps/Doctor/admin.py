from django.contrib import admin
from apps.Doctor.models import Doctor

# Register your models here.

admin.site.register(Doctor,admin.ModelAdmin)