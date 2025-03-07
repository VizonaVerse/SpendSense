from rest_framework import serializers
from spendsense_api.models import Pension, Job, Ending

class PensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pension
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class EndingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ending
        fields = '__all__'
