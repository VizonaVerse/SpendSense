from django.db import models

# Create your models 
class Pension(models.Model):
    pension_description = models.TextField(null=True, blank=True)
    pension_type = models.CharField(max_length=255, null=True, blank=True)

class Job(models.Model):
    job_name = models.CharField(max_length=255, null=True, blank=True)
    job_description = models.TextField(null=True, blank=True)
    pension_id = models.ForeignKey(Pension, on_delete=models.SET_NULL, null=True)
    job_outfit = models.CharField(max_length=255, null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

class Ending(models.Model):
    ending_id = models.AutoField(primary_key=True)
    ending_description = models.TextField(null=True, blank=True)
    ending_picture = models.ImageField(null=True, blank=True)
