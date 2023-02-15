from rest_framework.pagination import CursorPagination

class DateCursorPagination(CursorPagination):
    ordering = '-date'