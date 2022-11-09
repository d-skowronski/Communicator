import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings
from .models import ChatRoom, Message, User
from channels.db import database_sync_to_async

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
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_id
        # async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        # self.accept()
        # self.backlog = self.get_messages(10)
        
        # for message in self.backlog[::-1]:
        #     self.send(text_data=json.dumps({
        #         'type':'chat',
        #         'message': message.content,
        #         'username': message.sender.username,
        #         "profilePicture": message.sender.profilePicture.url,
        #     }))
        
    def disconnect(self, close_code):
        pass
    
    def receive(self, text_data):
        data = json.loads(text_data)
        
        text = data["text"]
        user = self.scope['user']
        room_id = data["room_id"]
        
        print(self.joined_rooms_ids)
        
        if room_id in self.joined_rooms_ids:
            self.add_message(room=self.joined_rooms.get(pk=int(room_id)), sender=user, message=text)
            
            async_to_sync(self.channel_layer.group_send)(
                room_id,
                {
                    "type": "chat_message",
                    "username": user.username,
                    "text": text,
                    "profilePicture": user.profilePicture.url
                }
            )
        
    def chat_message(self, event):
        text = event['text']
        username = event['username']
        profilePicture = event['profilePicture']
        
        self.send(text_data=json.dumps({
            'type':'chat',
            'text': text,
            'username': username,
            "profilePicture": profilePicture,
        }))

    def get_messages(self, count):
        return Message.objects.filter(room = ChatRoom.objects.get(pk=self.room_id)).order_by('-date')[:count]
    
    def get_rooms(self):
        return ChatRoom.objects.filter(users = self.scope['user'])
    
    def add_message(self, room, sender, message):
        message = Message.objects.create(room=room, sender=sender, content=message)
        message.save()
        return message