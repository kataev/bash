from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
#from app.views import home, done, logout, error

urlpatterns = patterns('',
    url(r'^$', 'bash.views.home', name=u'home'),
    url(r'^add$', 'bash.views.add', name=u'add'),

    url(r'^success/(?P<pk>\d+)', 'bash.views.success','success'),
    url(r'^page/(?P<page>\d+)$', 'bash.views.home', name=u'home_page'),

    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('social_auth.urls')),
    url(r'', include('api.urls')),

)

