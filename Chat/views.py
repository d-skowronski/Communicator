from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

# Create your views here.

def login(request):
    pass
def logout(request):
    pass
def register(request):
    pass
def home(request):
    return render(request, 'Chat/main_page.html')