from django.urls import path
from . import views

app_name = "Chat"
urlpatterns = [
    path('', views.home, name='home'),
]
