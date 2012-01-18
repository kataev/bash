# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django import forms

class Quote(models.Model):
    text = models.TextField(u'Текст цитаты',max_length=300)
    author = models.ForeignKey(User,verbose_name=u'Постер')
    accepted = models.BooleanField(u'Утверждена')

    class Meta:
        ordering = ('-id',)

class Vote(models.Model):
    user = models.ForeignKey(User,verbose_name=u'Голосующий')
    vote = models.BooleanField(u'Плюс или минус')
    quote = models.ForeignKey(Quote,verbose_name=u'Цитата')
