# -*- coding: utf-8 -*-
__author__ = 'bteam'
__author__ = 'bteam'
from django.conf.urls.defaults import *
from piston.resource import Resource
from handlers import *
quote_handler = Resource(QuoteHandler)
vote_handler = Resource(VoteHandler)

urlpatterns = patterns('',
    url(r'^quote/(?P<id>\d+)$', quote_handler),
    url(r'^quote$', quote_handler),

    url(r'^quote/(?P<id>\d+)/(?P<vote>plus|minus)$', vote_handler),
    url(r'^quote/(?P<id>\d+)/votes$', vote_handler),
)
