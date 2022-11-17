import json
from django.http import HttpRequest
from django.utils.html import escape, conditional_escape
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings
from .models import ChatRoom, Message, User
from channels.db import database_sync_to_async
from .api.serializers import MessageSerializer, UserSerializer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.joined_rooms = self.get_rooms()
        self.joined_rooms_ids = [str(room.id) for room in self.joined_rooms]
        for room in self.joined_rooms_ids:
            async_to_sync(self.channel_layer.group_add)(
                room,
                self.channel_name
            )
        
    def disconnect(self, close_code):
        pass
    
    def receive(self, text_data):
        data = json.loads(text_data)
        user = self.scope['user']
        
        if data['information_type'] == "chat_message":
            text = escape(data["content"])
            room_id = str(data["room"])
            if room_id in self.joined_rooms_ids and text:
                message = self.add_message(room=self.joined_rooms.get(pk=int(room_id)), sender=user, message=text)
                async_to_sync(self.channel_layer.group_send)(
                    room_id,
                    {
                        "type": "chat_message",
                        "message": message
                    }
                )
        elif data['information_type'] == "message_read":
            message = Message.objects.get(pk = int(data['id']))
            if message.room in self.joined_rooms:
                message.readBy.add(user)
                async_to_sync(self.channel_layer.group_send)(
                        str(message.room.id),
                        {
                            "type": "message_read",
                            "message_object": message,
                            "read_user": UserSerializer(user).data
                        }
                    )
            
            
        
    def chat_message(self, event):
        mock_request = HttpRequest()
        mock_request.user = self.scope['user']
        
        message = MessageSerializer(event['message'], context={'request': mock_request}).data
        self.send(text_data=json.dumps(message))
        
    def message_read(self, event):
        message = {
            'information_type': event['type'],
            "message_id": event['message_object'].id,
            "room": event['message_object'].room.id,
            'read_user': event['read_user'],
        }
        self.send(text_data=json.dumps(message))

    def get_messages(self, count):
        return Message.objects.filter(room = ChatRoom.objects.get(pk=self.room_id)).order_by('-date')[:count]
    
    def get_rooms(self):
        return ChatRoom.objects.filter(users = self.scope['user'])
    
    def add_message(self, room, sender, message):
        message = Message.objects.create(room=room, sender=sender, content=message)
        message.save()
        return message