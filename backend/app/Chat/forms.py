from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model

class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Email/Username", widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={'class': 'form-control'}))
        
        
class RegisterForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password1', 'password2')
        widgets = {
            'username':forms.TextInput(attrs={'class':'form-control', 'required': True}),
            'email':forms.EmailInput(attrs={'class':'form-control', 'required': True})
        }
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)    
        self.fields['password1'].widget = forms.PasswordInput(attrs={'class':'form-control'})
        self.fields['password2'].widget = forms.PasswordInput(attrs={'class':'form-control', 'autocomplete': 'off',})