# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Quote(models.Model):
    text = models.TextField(u'Текст цитаты',max_length=300)
    author = models.ForeignKey(User,verbose_name=u'Постер')
    accepted = models.BooleanField(u'Утверждена',default=False)
    datetime = models.DateTimeField(u'Дата добаления',auto_now_add=True)
    rating = models.IntegerField(u'Сводный рейтинг',default=0)

    def __unicode__(self):
        return  u'Цитата "%s" от %s' % ( self.text,self.author.username)

    class Meta:
        verbose_name = u'Цитата'
        verbose_name_plural = u'Цитаты'
        ordering = ('-rating','id')

votes = ((True,'За'),(False,'Против'))

class Vote(models.Model):
    user = models.ForeignKey(User,verbose_name=u'Голосующий')
    vote = models.BooleanField(u'Плюс или минус',choices=votes)
    quote = models.ForeignKey(Quote,verbose_name=u'Цитата')

    class Meta:
        verbose_name = u'Голос'
        verbose_name_plural = u'Голоса'
        ordering = ('-id',)

@receiver(post_save,sender=Vote)
def Rating(instance, created, *args,**kwargs):
    if instance.vote:
        instance.quote.rating+=1
    else:
        instance.quote.rating-=1
    instance.quote.save()