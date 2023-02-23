from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('rooms/', views.RoomListCreate.as_view()),
    path('rooms/<int:pk>/', views.RoomDetail.as_view()),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('messages/', views.MessagesList.as_view()),
    path('messages/<int:pk>/', views.MessagesDetail.as_view()),
    path('signup/', views.UserSignup.as_view()),
    path(
        'token/',
        views.MyTokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
