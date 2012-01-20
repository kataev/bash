# -*- coding: utf-8 -*-
__author__ = 'bteam'
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render,redirect
from bash.quotes.models import *

def home(request,page=1):
    paginator = Paginator(Quote.objects.all(), 7)
    try:
        quotes = paginator.page(page)
    except PageNotAnInteger:
        quotes = paginator.page(1)
    except EmptyPage:
        quotes = paginator.page(paginator.num_pages)

    return render(request,'index.html',dict(quotes=quotes))