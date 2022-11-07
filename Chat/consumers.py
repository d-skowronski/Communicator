import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_id
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()
        
        
    def disconnect(self, close_code):
        pass
    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "username": self.scope['user'].username,
                "message": text_data_json["message"],
                "profilePicture": self.scope['user'].profilePicture.url
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
