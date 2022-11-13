from django.urls import path, include
from . import views
from .api import api_views

app_name = "Chat"
urlpatterns = [
    path('api/ChatRoom/', api_views.ChatRoomList.as_view()),
    path('api/ChatRoom/<int:pk>/', api_views.ChatRoomDetail.as_view()),
    path('api/user/', api_views.UserList.as_view()),
    path('api/user/<int:pk>/', api_views.UserDetail.as_view()),
    path('', views.home, name='home'),
    path('register/', views.registerUser, name='register'),
    path('login/', views.loginUser, name='login'),
    path('logout/', views.logoutUser, name='logout'),
]
