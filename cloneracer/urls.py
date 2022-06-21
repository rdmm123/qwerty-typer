from django.urls import path

from cloneracer.views import HomePageView, SingleRacerView, generate_text

urlpatterns = [
    path('', HomePageView.as_view(), name='single_racer'),
    path('solo/', SingleRacerView.as_view(), name='single_racer'),
    path('api/generate/', generate_text, name='generate_text'),
]
