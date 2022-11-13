from rest_framework import serializers
from ..models import ChatRoom, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profilePicture']
        
        
class ChatRoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    name = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'thumbnail', 'users']
        
    def get_name(self, obj):
        if obj.name:
            return obj.name
        
        return obj.getDisplayUser(self.context['request'].user).username

    def get_thumbnail(self, obj):
        request = self.context['request']
        return request.build_absolute_uri(obj.getDisplayUser(request.user).profilePicture.url)