# run python manage.py test spendsense_api

from django.db.utils import IntegrityError
from django.test import TestCase
from spendsense_api.models import UserData
from cryptography.fernet import Fernet, InvalidToken
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from spendsense_api.models import Job
from spendsense_api.access import IsAdminOrReactWebsite
from rest_framework.test import APIClient
from django.contrib.auth.models import User

def decrypt(encrypted_text):
    cipher = Fernet('owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO7k=')
    return cipher.decrypt(encrypted_text.encode()).decode()
def decryptInvalid(encrypted_text):
    cipher = Fernet('owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO6y=')
    return cipher.decrypt(encrypted_text.encode()).decode()

# Checks Users are created correctly and that the username is unique
# Also checks that Location and Name are encrypted correctly
class UserDataModelTest(TestCase):
    def test_user_data_creation(self):
        user = UserData.objects.create(
            name="bob",
            username="bob",
            age=25,
            location="London",
            full_time_education=True,
            final_money=1000,
        )
        self.assertEqual(decrypt(user.name), "bob")
        self.assertEqual(user.username, "bob")
        self.assertEqual(user.age, 25)
        self.assertEqual(decrypt(user.location), "London")
        self.assertTrue(user.full_time_education)
        self.assertEqual(user.final_money, 1000)

    def test_unique_username_constraint(self):
        UserData.objects.create(
            name="bob",
            username="bob",
            age=30,
            location="London",
            full_time_education=True,
            final_money=1000,
        )
        with self.assertRaises(IntegrityError):
            UserData.objects.create(
                name="bob2",
                username="bob",  # Duplicate username
                age=25,
                location="Manchester",
                full_time_education=False,
                final_money=500,
            )

# Checks that Job endpoint returns the correct data and handles empty database correctly
class JobEndpointTest(APITestCase):
    def setUp(self):
        # Create sample jobs for testing
        Job.objects.create(
            title="Software Engineer",
            api_title="software engineer",
            min_salary=30000,
            max_salary=50000,
            pension="contribution",
        )
        Job.objects.create(
            title="Data Scientist",
            api_title="data scientist",
            min_salary=40000,
            max_salary=60000,
            pension="benefit",
        )

    def test_job_list_endpoint(self):
        # Test that the endpoint returns a list of jobs
        url = reverse('job-list')  # Replace 'job-list' with the actual name of your endpoint
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Ensure two jobs are returned
        self.assertIn('title', response.data[0])  # Check that the response contains the correct fields
        self.assertIn('min_salary', response.data[0])
        self.assertIn('max_salary', response.data[0])
        self.assertIn('pension', response.data[0])

    def test_job_list_no_jobs(self):
        # Test the response when no jobs exist in the database
        Job.objects.all().delete()  # Clear all jobs
        url = reverse('job-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Ensure the response is an empty list

# Checks permissions ofc
class PermissionTest(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="admin", password="adminpass", email="adminwhatever@gmail.com"
        )
        self.regular_user = User.objects.create_user(
            username="user", password="userpass", email="userwhatever@gmail.com"
        )
        # Create a UserData object for testing
        UserData.objects.create(
            name="bob",
            username="bob",
            age=25,
            location="London",
            full_time_education=True,
            final_money=1000,
        )
        # Set up API client
        self.client = APIClient()
        self.valid_key = "owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO7k="

    # Tests encryption key requirement and admin permissions
    def test_admin_access(self):
        # Authenticate as admin
        self.client.login(username="admin", password="adminpass")
        url = reverse("userdata-list") + f"?key={self.valid_key}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_regular_user_access_denied(self):
        # Authenticate as a regular user
        self.client.login(username="user", password="userpass")
        url = reverse("userdata-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_access_with_valid_token(self):
        # Test access with a valid token
        self.client.credentials(HTTP_TOKEN="icallthisarandomtoken")
        url = reverse("userdata-list") + f"?key={self.valid_key}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_access_with_invalid_token(self):
        # Test access with an invalid token
        self.client.credentials(HTTP_TOKEN="invalid token")
        url = reverse("userdata-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_access_with_valid_token_2(self):
        # Test access with a valid token
        self.client.credentials(HTTP_TOKEN="icallthisarandomtoken")
        url = reverse("userdata-update", kwargs={"username": "bob"})
        response = self.client.put(url, {"final_money": 2000})  # Use PUT with valid data
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_access_with_invalid_token_2(self):
        # Test access with an invalid token
        self.client.credentials(HTTP_TOKEN="invalid token")
        url = reverse("userdata-update", kwargs={"username": "bob"})
        response = self.client.put(url, {"final_money": 2000})  # Use PUT with valid data
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ErrorHandlingTest(APITestCase):
    def test_invalid_decryption_key(self):
        # Test error when an invalid decryption key is used
        user = UserData.objects.create(
            name="bob",
            username="bob",
            age=25,
            location="London",
            full_time_education=True,
            final_money=1000,
        )
        with self.assertRaises(InvalidToken):
            decryptInvalid(user.name)