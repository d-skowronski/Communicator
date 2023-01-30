from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenBackendError, TokenError

User = get_user_model()

class JWTAuthMiddleware:
    '''
    Based on https://github.com/joshua-hashimoto/django-channels-jwt-auth-middleware
    v. 1.0.0

    Modifications:
        - depends on simplejwt library
        - simplejwt AccessToken object in scope (scope['token'])
        - scope token making it possible to check for connection validity in consumer
        - in case of token issues uses anonymous user
    '''
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        close_old_connections()
        try:
            if(jwt_token_list := parse_qs(scope["query_string"].decode("utf8")).get('token', None)):
                jwt_token = jwt_token_list[0]
                jwt_token_object = AccessToken(token=jwt_token)
                user = await self.get_logged_in_user(jwt_token_object.get('user_id'))
                scope['user'] = user
                scope['token'] = jwt_token_object
            else:
                scope['user'] = AnonymousUser()
        except (TokenBackendError, TokenError):
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)

    def get_token_object(self, jwt_token):
        token = AccessToken(token=jwt_token)
        return token

    async def get_logged_in_user(self, user_id):
        user = await self.get_user(user_id)
        return user

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
