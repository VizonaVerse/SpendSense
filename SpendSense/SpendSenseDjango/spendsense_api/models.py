from django.db import models
from cryptography.fernet import Fernet

class Job(models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)
    api_title = models.CharField(max_length=255, null=True, blank=True)
    min_salary = models.IntegerField()
    max_salary = models.IntegerField()
    pension = models.CharField(max_length=255)
    job_outfit = models.ImageField(null=True, blank=True, default='sprite_base.png')

class Ending(models.Model):
    ending_id = models.AutoField(primary_key=True)
    ending_description = models.TextField(null=True, blank=True)
    ending_picture = models.ImageField(null=True, blank=True)

class UserData(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    username = models.CharField(max_length=255, null=False, blank=False, unique=True)
    age = models.IntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    full_time_education = models.BooleanField(null=True, blank=True)
    final_money = models.IntegerField(null=True, blank=True)
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