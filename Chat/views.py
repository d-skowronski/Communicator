from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render
from django.urls import reverse
from .forms import LoginForm
from django.contrib import messages
# Create your views here.

def loginUser(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('Chat:home'))
        else:
            messages.info(request, "Username or password incorrect")
    context = {}
    return render(request, 'Chat/main_page.html', context)    



def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('Chat:home'))


def registerUser(request):
    pass


def home(request):
    loginForm = LoginForm()
    context = {'loginForm': loginForm}
    return render(request, 'Chat/main_page.html', context)