from django.urls import path, include
from spendsense_api import api_views
from rest_framework import routers

router = routers.DefaultRouter()
urlpatterns = [
    path('api/', api_views.ApiView.as_view(), name='api-root'),
    path('api/pension/', api_views.PensionList.as_view(), name='pension-list'),
    path('api/pension/<int:pk>/', api_views.PensionDetail.as_view(), name='pension-detail'),
    path('api/job/', api_views.JobList.as_view(), name='job-list'),
    path('api/job/<int:pk>/', api_views.JobDetail.as_view(), name='job-detail'),
    path('api/ending/', api_views.EndingList.as_view(), name='ending-list'),
    path('api/ending/<int:pk>/', api_views.EndingDetail.as_view(), name='ending-detail'),
]