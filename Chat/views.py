from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import redirect, render
from django.urls import reverse
from .forms import LoginForm, RegisterForm
from django.contrib import messages
# Create your views here.

def loginUser(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
        else:
            messages.info(request, "Username or password incorrect")
    context = {}
    return HttpResponseRedirect(reverse('Chat:home'))



def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('Chat:home'))

def registerUser(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Registered!")
        else:
            messages.error(request, "Invalid credentials privided")
    return HttpResponseRedirect(reverse('Chat:home'))


def home(request):
    if request.user.is_authenticated:
        context = {}
        return render(request, 'Chat/home.html', context)
    else:
        registerForm = RegisterForm()
        loginForm = LoginForm()
        context = {'loginForm': loginForm, 'registerForm': registerForm}
        return render(request, 'Chat/main_page.html', context)