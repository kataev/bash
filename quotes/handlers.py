# -*- coding: utf-8 -*-
__author__ = 'bteam'
from piston.handler import BaseHandler
from piston.models import Consumer
from models import Quote
from piston.utils import rc

class QuoteHandler(BaseHandler):
    model = Quote
    fields = ('id', 'text',('author',('username','email')))


    def create(self, request, *args, **kwargs):
        if not self.has_model():
            return rc.NOT_IMPLEMENTED

        attrs = self.flatten_dict(request.data)

        try:
            inst = self.queryset(request).get(**attrs)
            return rc.DUPLICATE_ENTRY
        except self.model.DoesNotExist:
            attrs['author'] = request.user
            inst = self.model(**attrs)
            inst.save()
            return inst
        except self.model.MultipleObjectsReturned:
            return rc.DUPLICATE_ENTRY

