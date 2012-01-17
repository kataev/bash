# -*- coding: utf-8 -*-
__author__ = 'bteam'
from django.shortcuts import render

def home(request):

    print request.user

    return render(request,'index.html')