# -*- coding: utf-8 -*-
__author__ = 'bteam'
from django.contrib import admin
from models import Quote,Vote

def make_published(modeladmin, request, queryset):
    queryset.update(accepted=True)
make_published.short_description = u"Опубликовать данные цитаты"


class QuoteAdmin(admin.ModelAdmin):
    list_display = ('text','author','accepted')
    list_filter = ('author','accepted')
    actions = (make_published,)

admin.site.register(Quote,QuoteAdmin)


class VoteAdmin(admin.ModelAdmin):
    list_display = ('get_vote_display','user','quote')
    list_filter = ('user','vote')

admin.site.register(Vote,VoteAdmin)