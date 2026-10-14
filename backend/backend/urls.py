from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .portfolio_demo import portfolio_demo

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('user.urls')),
    path('api/', include('mood.urls')),
    path('api/portfolio-demo/seed/', portfolio_demo, name='portfolio-demo-seed'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
