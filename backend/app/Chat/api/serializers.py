from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.password_validation import \
    validate_password as password_validator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from ..models import Message, Room, User


class SignupSerializer(serializers.ModelSerializer):
    '''
    Create new user, return access and refresh tokens when successful.
    Requires password1 and password2 fields. Uses django password validation.
    '''
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password1': 'Passwords don\'t match!'})
        return super().validate(attrs)

    def validate_password1(self, value):
        password_validator(value)
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user

    def to_representation(self, instance):
        '''Return jwt token pair instead of serialized user instance'''
        # Using:
        # refresh = RefreshToken.for_user(instance)
        #    return {
        #         'refresh': str(refresh),
        #         'access': str(refresh.access_token),
        #     }
        # would also work, however at the expense of extra db hits, using
        # MyTokenObtainPairSerializer provides more consistency with
        # encoded user fields

        tokens = MyTokenObtainPairSerializer(
            data={
                'username': instance.username,
                'password': self.validated_data['password1']},
            context=self.context
        )
        tokens.is_valid()

        return tokens.validated_data


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": _("Incorrect credentials")
    }

    def get_token(self, user):
        request = self.context['request']

        token = super().get_token(user)
        token['username'] = user.username
        token['profile_picture'] = request.build_absolute_uri(
            user.profile_picture.url)
        token['email'] = user.email

        return token


class UserSerializer(serializers.ModelSerializer):
    shared_rooms = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'shared_rooms']

    def get_shared_rooms(self, obj):
        return obj.chat_rooms.filter(
            pk__in=self.context['request'].user.chat_rooms.values_list(
                'pk',
                flat=True
            )
        ).values_list('pk', flat=True)


class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture']


class MessageSerializer(serializers.ModelSerializer):
    information_type = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'information_type',
            'room',
            'content_text',
            'sender',
            'read_by',
            'date'
        ]

    def get_information_type(self):
        return 'chat_message'


class RoomSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    information_type = serializers.SerializerMethodField()
    users = BasicUserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            'id',
            'information_type',
            'name', 'thumbnail',
            'created',
            'last_message',
            'users',
            'users_id'
        ]
        extra_kwargs = {
            'users_id': {'source': 'users', 'write_only': True}
        }

    def validate_users_id(self, value):
        value = set(value)
        if len(value) < 2:
            raise serializers.ValidationError(
                {'users': 'Provide at least one extra user beside yourself'}
            )
        return value

    def create(self, validated_data):
        room = Room()
        room.save()
        room.users.add(*validated_data['users'])

        channel_layer = get_channel_layer()
        print(validated_data['users'])
        for user in validated_data['users']:
            async_to_sync(channel_layer.group_send)(f'user_{user.id}', {
                "type": "room_created",
                "room_object": room,
            })

        return room

    def get_name(self, obj):
        if obj.name:
            return obj.name

        return obj.getDisplayUser(self.context['request'].user).username

    def get_thumbnail(self, obj):
        request = self.context['request']
        return request.build_absolute_uri(
            obj.getDisplayUser(request.user).profile_picture.url)

    def get_last_message(self, obj):
        message = obj.messages.last()
        if message:
            return MessageSerializer(
                obj.messages.last(),
                context=self.context
            ).data
        else:
            return {}

    def get_information_type(self, obj):
        return 'chat_room'
