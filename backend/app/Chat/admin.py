from django.contrib import admin
from .models import User, Room, Message

# Register your models here.

admin.site.register(User)

class MessageInLine(admin.StackedInline):
    model = Message
    extra = 2


class RoomAdmin(admin.ModelAdmin):
    inlines = [MessageInLine]

admin.site.register(Room, RoomAdmin)
