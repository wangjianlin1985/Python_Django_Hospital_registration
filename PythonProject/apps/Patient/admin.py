from django.contrib import admin
from apps.Patient.models import Patient

# Register your models here.

admin.site.register(Patient,admin.ModelAdmin)