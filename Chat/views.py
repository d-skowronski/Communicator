from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render
from django.urls import reverse
# Create your views here.

def loginUser(request):
    pass
def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('Chat:home'))
def registerUser(request):
    pass
def home(request):
    return render(request, 'Chat/main_page.html')