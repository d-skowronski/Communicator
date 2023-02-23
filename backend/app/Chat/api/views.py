from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from ..models import Message, User
from .pagiation import DateCursorPagination
from .serializers import (MessageSerializer,
                          MyTokenObtainPairSerializer, RoomSerializer,
                          SignupSerializer, UserSerializer)


class UserSignup(generics.CreateAPIView):
    '''Create a new user'''
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        q = self.request.query_params.get('q')
        sharing_rooms = self.request.query_params.get('sharing_rooms')

        qs = User.objects.all()
        user = self.request.user

        if isinstance(sharing_rooms, str) and sharing_rooms.lower() == 'true':
            qs = qs.filter(chat_rooms__in=user.chat_rooms.all())

        if isinstance(q, str):
            qs = qs.filter(username__icontains=q)

        return qs.distinct()


class UserDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()


class RoomListCreate(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.chat_rooms.all()

    def create(self, request, *args, **kwargs):
        request.data['users_id'].append(self.request.user.id)
        return super().create(request, *args, **kwargs)


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
    pagination_class = DateCursorPagination

    def get_queryset(self):
        user = self.request.user
        param = self.request.query_params.get('room_id')
        room_id = int(param) if param is not None and param.isdigit() else None

        qs = Message.objects.filter(room__in=user.chat_rooms.all())

        if room_id:
            print("ROOM")
            qs = qs.filter(room_id=room_id)

        return qs.distinct().order_by('-date')

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
                    "read_user": user,
                    })
        return objects


class MessagesDetail(generics.RetrieveUpdateAPIView):
    serializer_class = MessageSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        qs = Message.objects.filter(room__in=user.chat_rooms.all())

        return qs.distinct()
