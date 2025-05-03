from rest_framework import serializers
from spendsense_api.models import Pension, Job, Ending, UserData
from rest_framework.validators import UniqueValidator

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

class UserDataSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=UserData.objects.all(),
                message="This username is already taken."
            )
        ]
    )

    class Meta:
        model = UserData
        fields = ['user_id', 'name', 'username', 'age', 'location', 'full_time_education']

class MoneyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['final_money']

