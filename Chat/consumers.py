import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings
from .models import ChatRoom, Message, User
from channels.db import database_sync_to_async
from .api.serializers import MessageSerializer

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
        
        text = data["content"]
        user = self.scope['user']
        room_id = data["room"]
        if room_id in self.joined_rooms_ids and text:
            message = self.add_message(room=self.joined_rooms.get(pk=int(room_id)), sender=user, message=text)
            async_to_sync(self.channel_layer.group_send)(
                room_id,
                {
                    "type": "chat_message",
                    "message": MessageSerializer(message).data
                }
            )
        
    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))

    def get_messages(self, count):
        return Message.objects.filter(room = ChatRoom.objects.get(pk=self.room_id)).order_by('-date')[:count]
    
    def get_rooms(self):
        return ChatRoom.objects.filter(users = self.scope['user'])
    
    def add_message(self, room, sender, message):
        message = Message.objects.create(room=room, sender=sender, content=message)
        message.save()
        return message