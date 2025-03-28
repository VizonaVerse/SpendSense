from django.db import models
from cryptography.fernet import Fernet

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

class UserData(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    full_time_education = models.BooleanField(null=True, blank=True)

    def encrypt_location(self, key):
        cipher = Fernet(key)
        self.location = cipher.encrypt(self.location.encode()).decode()
    
    def encrypt_name(self, key):
        cipher = Fernet(key)
        self.name = cipher.encrypt(self.name.encode()).decode()
    
    def save(self, *args, **kwargs):
        key = b'owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO7k='  # fernet key
        if self.name:
            self.encrypt_name(key)
        if self.location:
            self.encrypt_location(key)
        super().save(*args, **kwargs)