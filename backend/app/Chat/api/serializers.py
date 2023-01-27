from rest_framework import serializers
from ..models import Room, User, Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['profile_picture'] = user.profile_picture.url
        token['email'] = user.email

        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture']

class MessageSerializer(serializers.ModelSerializer):
    information_type = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'information_type', 'room', 'content_text','sender', 'read_by']

    def get_information_type(self, obj):
        return 'chat_message'


class RoomSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    information_type = serializers.SerializerMethodField()
    users = UserSerializer(many=True)

    class Meta:
        model = Room
        fields = ['id', 'information_type','name', 'thumbnail', 'last_message', 'users']

    def get_name(self, obj):
        if obj.name:
            return obj.name

        return obj.getDisplayUser(self.context['request'].user).username

    def get_thumbnail(self, obj):
        request = self.context['request']
        return request.build_absolute_uri(obj.getDisplayUser(request.user).profile_picture.url)

    def get_last_message(self, obj):
        message = obj.messages.last()
        if message:
            return MessageSerializer(obj.messages.last(), context=self.context).data
        else:
            return {}

    def get_information_type(self, obj):
        return 'chat_room'