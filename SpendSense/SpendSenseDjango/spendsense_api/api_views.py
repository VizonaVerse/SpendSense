#file for api viewsets
# we'll need to import generics and response from rest_framework and also serializers and models
from rest_framework import generics
from rest_framework.response import Response
from spendsense_api.models import Pension, Job, Ending
from spendsense_api.serializers import PensionSerializer, JobSerializer, EndingSerializer
from django.urls import reverse_lazy

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