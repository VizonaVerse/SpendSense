from django.db import models

# Create your models 
class Pension(models.Model):
    pension_id = models.AutoField(primary_key=True)
    pension_description = models.TextField
    pension_type = models.CharField

class Job(models.Model):
    job_id = models.AutoField(primary_key=True)
    job_name = models.CharField
    job_description = models.TextField
    pension_id = models.ForeignKey(Pension)
    job_outfit = models.CharField
    salary = models.DecimalField

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    age = models.IntegerField(null=False, blank=False)

class Payslip(models.Model):
    payslip_id = models.AutoField(primary_key=True)
    job_id = models.ForeignKey(Job)
    income_tax = models.DecimalField
    national_insurance = models.DecimalField
    pension_contribution = models.DecimalField
    student_loan = models.DecimalField
    other_deductions = models.DecimalField
    # we'll calculate net income and total deductions based on these fields

class Ending(models.Model):
    ending_id = models.AutoField(primary_key=True)
    ending_description = models.TextField
    ending_picture = models.ImageField
    