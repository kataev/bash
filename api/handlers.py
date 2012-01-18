# -*- coding: utf-8 -*-
__author__ = 'bteam'
from piston.handler import BaseHandler
from quotes.models import Quote,Vote
from piston.utils import rc
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import redirect

class QuoteHandler(BaseHandler):
    allowed_methods = ('GET','POST')
    model = Quote
    fields = ('id', 'text', 'vote_set', ('author', ('username', ('social_auth', ('uid',)))))

    def create(self, request, *args, **kwargs):
        if not self.has_model():
            return rc.NOT_IMPLEMENTED

        if not request.user.is_active():
            return rc.FORBIDDEN

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

    def read(self, request, *args, **kwargs):
        if not self.has_model():
            return rc.NOT_IMPLEMENTED

        pkfield = self.model._meta.pk.name

        if pkfield in kwargs:
            try:
                return self.queryset(request).get(pk=kwargs.get(pkfield))
            except ObjectDoesNotExist:
                return rc.NOT_FOUND
            except MultipleObjectsReturned: # should never happen, since we're using a PK
                return rc.BAD_REQUEST
        else:
            page = request.GET.get('page',1)
            perPage = request.GET.get('perPage',10)

            try:
                perPage = int(perPage)
            except ValueError:
                return rc.BAD_REQUEST
            if perPage <=0: return rc.BAD_REQUEST
            paginator = Paginator(self.queryset(request).filter(*args, **kwargs), perPage)


            try:
                quotes = paginator.page(page)
            except PageNotAnInteger:
                quotes = paginator.page(1)
            except EmptyPage:
                quotes = paginator.page(paginator.num_pages)

            return dict(models=quotes.object_list,
                total = paginator.count,
                page = quotes.number,
                perPage = perPage
            )

class VoteHandler(BaseHandler):
    allowed_methods = ('GET','POST')
    model = Vote
    fields = ('vote',('user', ('username',)))

    def create(self, request, *args, **kwargs):
        if not self.has_model():
            return rc.NOT_IMPLEMENTED
        if not request.user.is_active:
            return rc.FORBIDDEN

        try:
            quote = Quote.objects.get(pk=kwargs.get('id',0))
        except Quote.DoesNotExist:
            return rc.NOT_FOUND

        vote = kwargs.get('vote')
        if vote =='minus': vote = False

        try:
            self.queryset(request).get(quote=quote,user=request.user)
            return rc.DUPLICATE_ENTRY
        except self.model.DoesNotExist:

            print 'olo'
            inst = self.model(quote=quote,user=request.user,vote=vote)
            inst.save()
            return redirect('/quote/%d/votes' % quote.pk)
        except self.model.MultipleObjectsReturned:
            return rc.DUPLICATE_ENTRY

    def read(self, request, *args, **kwargs):
        if not self.has_model():
            return rc.NOT_IMPLEMENTED
        try:
            quote = Quote.objects.get(pk=kwargs.get('id',0))
        except Quote.DoesNotExist:
            return rc.NOT_FOUND

        return Vote.objects.filter(quote=quote)

