# -*- coding: utf-8 -*-
__author__ = 'bteam'
from django.conf.urls.defaults import *
from piston.authentication import HttpBasicAuthentication,OAuthAuthentication
from piston.resource import Resource
from handlers import *
auth = OAuthAuthentication(realm="Test Realm")
#auth = HttpBasicAuthentication(realm="Django Piston Example")
quote_handler = Resource(QuoteHandler)#,authentication=auth)

urlpatterns = patterns('',
    url(r'^qoute/(?P<id>\d+)$', quote_handler),
    url(r'^quote$', quote_handler),

)


