import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.utils import aware_utcnow

from .api.serializers import MessageSerializer
from .models import Message, Room


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.accept()
            async_to_sync(self.channel_layer.group_add)(
                f'user_{user.id}',
                self.channel_name
            )
            self.joined_rooms = self.get_rooms()
            self.joined_rooms_ids = [
                str(room.id) for room in self.joined_rooms
            ]
            for room in self.joined_rooms_ids:
                async_to_sync(self.channel_layer.group_add)(
                    room,
                    self.channel_name
                )
        else:
            self.close()

    def disconnect(self, close_code):
        pass

    def send(self, *args, **kwargs):
        try:
            self.scope['token'].check_exp(current_time=aware_utcnow())
        except TokenError:
            self.close()
        else:
            return super().send(*args, **kwargs)

    def receive(self, text_data):
        try:
            self.scope['token'].check_exp(current_time=aware_utcnow())
        except TokenError:
            self.close()
        else:
            data = json.loads(text_data)
            user = self.scope['user']

            if data['information_type'] == "chat_message":
                text = data["content_text"].strip()
                room_id = str(data["room"])
                if room_id in self.joined_rooms_ids and len(text) > 0:
                    message = self.add_message(
                        room=self.joined_rooms.get(pk=int(room_id)),
                        sender=user,
                        message=text
                    )
                    async_to_sync(self.channel_layer.group_send)(
                        room_id,
                        {
                            "type": "chat_message",
                            "message": message
                        }
                    )

            elif data['information_type'] == "message_read":
                message = Message.objects.get(pk=int(data['id']))
                if message.room in self.joined_rooms:
                    message.read_by.add(user)
                    async_to_sync(self.channel_layer.group_send)(
                            str(message.room.id),
                            {
                                "type": "message_read",
                                "message_object": message,
                                "read_user": user,
                            }
                        )

    def chat_message(self, event):
        message = MessageSerializer(event['message']).data
        self.send(text_data=json.dumps(message))

    def message_read(self, event):
        message = {
            'information_type': event['type'],
            "message": event['message_object'].id,
            "room": event['message_object'].room.id,
            'read_user': event['read_user'].id,
        }
        self.send(text_data=json.dumps(message))

    def room_created(self, event):
        message = {
            'information_type': event['type'],
            'room_id': event['room_object'].id,
        }
        self.send(text_data=json.dumps(message))

    def get_messages(self, count):
        return Message.objects.filter(
            room=Room.objects.get(pk=self.room_id)).order_by('-date')[:count]

    def get_rooms(self):
        return Room.objects.filter(users=self.scope['user'])

    def add_message(self, room, sender, message):
        message = Message.objects.create(
            room=room,
            sender=sender,
            content_text=message
        )
        message.save()
        return message
