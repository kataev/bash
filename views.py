# -*- coding: utf-8 -*-
__author__ = 'bteam'
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect
from quotes.models import *

def home(request,page=1):
    paginator = Paginator(Quote.objects.all(), 7)
#    page = int(page)
#    page = request.GET.get('page',1)
    try:
        quotes = paginator.page(page)
    except PageNotAnInteger:
        quotes = paginator.page(1)
    except EmptyPage:
        quotes = paginator.page(paginator.num_pages)

    return render(request,'index.html',dict(quotes=quotes))

@login_required
def add(request):
    form = QuoteForm(request.POST)
    if form.is_valid():
        print form.cleaned_data
        q = Quote(text=form.cleaned_data.get('text'),author=request.user)
        q.save()
    else:
        return redirect('error')
    return redirect('home')