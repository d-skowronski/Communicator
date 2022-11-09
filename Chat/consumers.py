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
        for room in self.joined_rooms:
            print(room.pk)
            async_to_sync(self.channel_layer.group_add)(
                str(room.pk),
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
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = self.scope['user']
        room = text_data_json["room"]
        print(room)
        
        
        # print(self.add_message(message, user.username))
        
        async_to_sync(self.channel_layer.group_send)(
            room,
            {
                "type": "chat_message",
                "username": user.username,
                "message": text_data_json["message"],
                "profilePicture": user.profilePicture.url
            }
        )
        
    def chat_message(self, event):
        message = event['message']
        username = event['username']
        profilePicture = event['profilePicture']
        
        self.send(text_data=json.dumps({
            'type':'chat',
            'message': message,
            'username': username,
            "profilePicture": profilePicture,
        }))

    def get_messages(self, count):
        return Message.objects.filter(room = ChatRoom.objects.get(pk=self.room_id)).order_by('-date')[:count]
    
    def get_rooms(self):
        return ChatRoom.objects.filter(users = self.scope['user'])
    
    def add_message(self, message, username):
        message = Message.objects.create(room = ChatRoom.objects.get(pk=self.room_id), sender=User.objects.get(username=username), content=message)
        return message.save()