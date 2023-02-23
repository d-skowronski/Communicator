from django.contrib import admin
from .models import User, Room, Message
from django_admin_inline_paginator.admin import TabularInlinePaginated


class MessageInLine(TabularInlinePaginated):
    model = Message
    per_page = 4
    can_delete = True
    ordering = ['-date']


class RoomAdmin(admin.ModelAdmin):
    inlines = [MessageInLine]


admin.site.register(Room, RoomAdmin)
admin.site.register(User)
