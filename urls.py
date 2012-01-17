from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from app.views import home, done, logout, error

urlpatterns = patterns('',
    url(r'^$', 'bash.views.home', name='home'),

    url(r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),

    (r'^', include('quotes.urls')),

    url(r'', include('social_auth.urls')),

    url(r'^$', home, name='home'),
    url(r'^done/$', done, name='done'),
    url(r'^error/$', error, name='error'),
    url(r'^logout/$', logout, name='logout'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('social_auth.urls')),

)

