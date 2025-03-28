from django.contrib import admin

# Register your models here.

from .models import Job, Pension, Ending, UserData

admin.site.register(Job)
admin.site.register(Pension)
admin.site.register(Ending)
admin.site.register(UserData)