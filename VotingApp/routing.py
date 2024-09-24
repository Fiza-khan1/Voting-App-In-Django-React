from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/vote-count/$', consumers.VoteCountConsumer.as_asgi()),
   re_path(r'ws/notification/', consumers.NotificationConsumer.as_asgi()),
]
# routing.py
