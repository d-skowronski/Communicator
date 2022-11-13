from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import generics
from ..models import ChatRoom, User
from .serializers import ChatRoomSerializer, UserSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.all()
    
    
class UserDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.all()

class ChatRoomList(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return user.chat_rooms.all()
    
class ChatRoomDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ChatRoomSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        
        user = self.request.user
        return user.chat_rooms.all()
    
class MessagesList(generics.ListAPIView):
    serializer_class = MessageSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        param = self.request.query_params.get('chat_room_id')
        chatRoom = int(param) if param is not None and param.isdigit() else None
        print(chatRoom)
        return user.chat_rooms.get(pk=chatRoom).messages.all().prefetch_related('sender').order_by('-date')