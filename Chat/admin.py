from django.contrib import admin
from .models import User, ChatRoom, Message

# Register your models here.

admin.site.register(User)

class MessageInLine(admin.StackedInline):
    model = Message
    extra = 2


class ChatRoomAdmin(admin.ModelAdmin):
    inlines = [MessageInLine]

admin.site.register(ChatRoom, ChatRoomAdmin)
