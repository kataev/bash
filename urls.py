from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
#from app.views import home, done, logout, error

urlpatterns = patterns('',
    url(r'^$', 'bash.views.home', name='home'),
    url(r'^page/(?P<page>\d+)$', 'bash.views.home', name='home'),

    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('social_auth.urls')),
    url(r'', include('api.urls')),

)

