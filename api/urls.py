# -*- coding: utf-8 -*-
__author__ = 'bteam'
__author__ = 'bteam'
from django.conf.urls.defaults import *
from piston.resource import Resource
from handlers import *
quote_handler = Resource(QuoteHandler)

urlpatterns = patterns('',
    url(r'^qoute/(?P<id>\d+)$', quote_handler),
    url(r'^quote$', quote_handler),

)
