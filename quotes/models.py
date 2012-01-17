# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User

class Quote(models.Model):
    text = models.TextField(u'Текст цитаты',max_length=300)
    author = models.ForeignKey(User,verbose_name=u'Постер')
    accepted = models.BooleanField(u'Утверждена')
