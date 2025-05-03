#file for api viewsets
# we'll need to import generics and response from rest_framework and also serializers and models
from rest_framework import generics
from rest_framework.response import Response
from spendsense_api.models import Pension, Job, Ending, UserData
from spendsense_api.access import IsAdminOrReactWebsite
from spendsense_api.serializers import PensionSerializer, JobSerializer, EndingSerializer, UserDataSerializer, MoneyUpdateSerializer
from django.urls import reverse_lazy
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import ValidationError
from cryptography.fernet import Fernet

class PensionList(generics.ListCreateAPIView):
    queryset = Pension.objects.all()
    serializer_class = PensionSerializer

class PensionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pension.objects.all()
    serializer_class = PensionSerializer

class JobList(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class JobDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class EndingList(generics.ListCreateAPIView):
    queryset = Ending.objects.all()
    serializer_class = EndingSerializer

class EndingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ending.objects.all()
    serializer_class = EndingSerializer

class ApiView(generics.GenericAPIView):
    def get(self, request):
        endpoints = {
            'pension': request.build_absolute_uri(reverse_lazy('pension-list')),
            'job': request.build_absolute_uri(reverse_lazy('job-list')),
            'ending': request.build_absolute_uri(reverse_lazy('ending-list'))
        }
        return Response(endpoints)

class UserDataCreateView(generics.CreateAPIView):
    queryset = UserData.objects.defer('final_money')
    serializer_class = UserDataSerializer

class UserMoneyUpdateView(generics.UpdateAPIView):
    queryset = UserData.objects.all()
    serializer_class = MoneyUpdateSerializer
    permission_classes = [IsAdminOrReactWebsite]

    def get_object(self):
        # Retrieve the user by username from the URL
        username = self.kwargs.get('username')
        try:
            return UserData.objects.get(username=username)
        except UserData.DoesNotExist:
            raise ValidationError({"error": "User with the given username does not exist."})

    def update(self, request, *args, **kwargs):
        # Get the user instance
        user = self.get_object()

        # Extract the "final_money" value from the request data
        final_money = request.data.get("final_money")
        if final_money is None:
            raise ValidationError({"error": "The 'final_money' field is required."})

        # Update the "final_money" attribute
        user.final_money = final_money
        user.save()

        # Return the updated user data
        return Response({"user_id": user.user_id, "username": user.username, "final_money": user.final_money})

class UserDataListView(generics.ListAPIView):
    queryset = UserData.objects.all()
    serializer_class = UserDataSerializer
    permission_classes = [IsAdminUser]  # Only admin users can access

    def get(self, request, *args, **kwargs):
        decryption_key = request.query_params.get('key')  # Example: /api/userdata/?key=your_key_here
        if not decryption_key:
            raise ValidationError({"error": "Decryption key is required."})

        try:
            # Initialize the cipher with the provided key
            cipher = Fernet(decryption_key.encode())
        except Exception:
            raise ValidationError({"error": "Invalid decryption key."})

        # Decrypt the data
        decrypted_data = []
        for user in self.get_queryset():
            try:
                decrypted_name = cipher.decrypt(user.name.encode()).decode() if user.name else None
                decrypted_location = cipher.decrypt(user.location.encode()).decode() if user.location else None
                decrypted_data.append({
                    "user_id": user.user_id,
                    "name": decrypted_name,
                    "username": user.username,
                    "age": user.age,
                    "location": decrypted_location,
                    "full_time_education": user.full_time_education,
                    "final_money": user.final_money,
                })
            except Exception:
                raise ValidationError({"error": "Decryption failed for one or more records."})

        return Response(decrypted_data)
