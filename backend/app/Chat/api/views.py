from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import generics
from ..models import Room, User
from .serializers import RoomSerializer, UserSerializer, MessageSerializer, MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()


class UserDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

class RoomList(generics.ListAPIView):
    serializer_class = RoomSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.chat_rooms.all()

class RoomDetail(generics.RetrieveUpdateAPIView):
    serializer_class = RoomSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]


    def get_queryset(self):

        user = self.request.user
        return user.chat_rooms.all()

class MessagesList(generics.ListAPIView):
    serializer_class = MessageSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        param = self.request.query_params.get('chat_room_id')
        Room = int(param) if param is not None and param.isdigit() else None
        print(Room)
        return user.chat_rooms.get(pk=Room).messages.all().prefetch_related('sender').order_by('-date')

    def paginate_queryset(self, *args, **kwargs):
        user = self.request.user
        channel_layer = get_channel_layer()
        objects = super().paginate_queryset(*args, **kwargs)
        for object in objects:
            users_who_have_read = object.read_by.all()
            if user not in users_who_have_read:
                object.read_by.add(user)
                async_to_sync(channel_layer.group_send)(str(object.room.id), {
                    "type": "message_read",
                    "message_object": object,
                    "read_user": UserSerializer(user).data,
                    })
        return objects