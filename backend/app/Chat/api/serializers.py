from rest_framework import serializers
from ..models import ChatRoom, User, Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profilePicture']

class MessageSerializer(serializers.ModelSerializer):
    information_type = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    profilePicture = serializers.SerializerMethodField()
    readBy = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'information_type', 'room', 'content','username', 'profilePicture', 'readBy']

    def get_information_type(self, obj):
        return 'chat_message'

    def get_username(self, obj):
        return obj.sender.username

    def get_profilePicture(self, obj):
        return obj.sender.profilePicture.url

    def get_readBy(self, obj):
        return list(obj.readBy.all().values_list('username', flat=True))


class ChatRoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    name = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'thumbnail', 'last_message', 'users']

    def get_name(self, obj):
        if obj.name:
            return obj.name

        return obj.getDisplayUser(self.context['request'].user).username

    def get_thumbnail(self, obj):
        request = self.context['request']
        return request.build_absolute_uri(obj.getDisplayUser(request.user).profilePicture.url)

    def get_last_message(self, obj):
        return MessageSerializer(obj.messages.last(), context=self.context).data