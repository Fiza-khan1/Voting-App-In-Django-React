import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
import json
from channels.generic.websocket import AsyncWebsocketConsumer

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Count
import json

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


class VoteCountConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "vote_count_group"

        # Join the vote count group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        await self.send_vote_counts()

    async def disconnect(self, close_code):
        # Leave the vote count group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def update_vote_count(self, event):
        await self.send_vote_counts()

    async def send_vote_counts(self):
        option_counts = await self.get_option_counts()
        agenda_counts = await self.get_agenda_counts()
        formatted_agenda_counts = await self.format_agenda_counts(agenda_counts, option_counts)
        await self.send(text_data=json.dumps({
            'agenda_counts': formatted_agenda_counts
        }))

    @database_sync_to_async
    def get_option_counts(self):
        from .models import Option
        return list(
            Option.objects
            .annotate(vote_count=Count('vote'))
            .values('id', 'name', 'vote_count', agenda_id=Count('agenda'))  # Correctly annotate related data
        )

    @database_sync_to_async
    def get_agenda_counts(self):
        from .models import Agenda
        return list(
            Agenda.objects
            .annotate(vote_count=Count('vote'))
            .values('id', 'name', 'description', 'vote_count')
        )

    @database_sync_to_async
    def format_agenda_counts(self, agenda_counts, option_counts):
        # Create a map of agenda counts
        agenda_map = {agenda['id']: {
            'id': agenda['id'],
            'name': agenda['name'],
            'description': agenda['description'],
            'vote_count': agenda['vote_count'],
            'options': []
        } for agenda in agenda_counts}
        
        # Append options to their corresponding agendas
        for option in option_counts:
            # Since `option['agenda_id']` does not exist, we need to obtain the related agenda directly
            agenda_id = option.get('agenda')  # Correctly retrieve agenda ID based on your relationship
            if agenda_id in agenda_map:
                agenda_map[agenda_id]['options'].append({
                    'id': option['id'],
                    'name': option['name'],
                    'vote_count': option['vote_count']
                })

        return list(agenda_map.values())

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Count
from asgiref.sync import sync_to_async, async_to_sync


class VoteCountConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "vote_count_group"

        # Join the vote count group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        await self.send_vote_counts()

    async def disconnect(self, close_code):
        # Leave the vote count group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def update_vote_count(self, event):
        await self.send_vote_counts()

    async def send_vote_counts(self):
        option_counts = await self.get_option_counts()
        agenda_counts = await self.get_agenda_counts()
        formatted_agenda_counts = await self.format_agenda_counts(agenda_counts, option_counts)
        await self.send(text_data=json.dumps({
            'agenda_counts': formatted_agenda_counts
        }))

    @sync_to_async
    def get_option_counts(self):
        from .models import Option
        return list(
            Option.objects
            .annotate(vote_count=Count('vote'))
            .values('id', 'name', 'vote_count', agenda_id=Count('agendas'))  # Note: 'agenda_id' should be fetched from the agenda relation
        )

    @sync_to_async
    def get_agenda_counts(self):
        from .models import Agenda
        return list(
            Agenda.objects
            .annotate(vote_count=Count('vote'))
            .values('id', 'name', 'description', 'vote_count')
        )

    @sync_to_async
    def format_agenda_counts(self, agenda_counts, option_counts):
        # Create a map of agenda counts
        agenda_map = {agenda['id']: {
            'id': agenda['id'],
            'name': agenda['name'],
            'description': agenda['description'],
            'vote_count': agenda['vote_count'],
            'options': []
        } for agenda in agenda_counts}
        
        # Append options to their corresponding agendas
        for option in option_counts:
            from .models import Option
            # Find the agenda related to this option
            related_agendas = Option.objects.filter(id=option['id']).values_list('agendas', flat=True)
            for agenda_id in related_agendas:
                if agenda_id in agenda_map:
                    agenda_map[agenda_id]['options'].append({
                        'id': option['id'],
                        'name': option['name'],
                        'vote_count': option['vote_count']
                    })

        return list(agenda_map.values())





# class VoteCountConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.group_name = "vote_count_group"

#         # Join the vote count group
#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )
#         await self.accept()
#         await self.send_vote_counts()

#     async def disconnect(self, close_code):
#         # Leave the vote count group
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )

#     async def update_vote_count(self, event):
#         await self.send_vote_counts()

#     async def send_vote_counts(self):
#         option_counts = await self.get_option_counts()
#         agenda_counts = await self.get_agenda_counts()
#         await self.send(text_data=json.dumps({
#             'option_counts': option_counts,
#             'agenda_counts': agenda_counts,
#         }))

#     @database_sync_to_async
#     def get_option_counts(self):
#         from .models import Option
#         from django.db.models import Count

#         return list(
#             Option.objects
#             .annotate(vote_count=Count('vote'))
#             .values('id', 'name', 'vote_count')
#         )

#     @database_sync_to_async
#     def get_agenda_counts(self):
#         from .models import Agenda
#         from django.db.models import Count

#         return list(
#             Agenda.objects
#             .annotate(vote_count=Count('vote'))
#             .values('id', 'name', 'description', 'vote_count')
#         )

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query parameters
        query_string = self.scope.get('query_string', b'').decode()
        token = query_string.split('token=')[-1] if 'token=' in query_string else ''

        # Try to authenticate the token asynchronously
        self.user = await self.get_user_from_token(token)
        
        # Assign group names based on the user
        from django.contrib.auth.models import AnonymousUser

        if isinstance(self.user, AnonymousUser):
            self.user_group_name = "anonymous"
        else:
            self.user_group_name = f"user_{self.user.id}"

        self.notification_group_name = "vote_notifications"

        # Add the user to both the user and notification groups
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the groups when they disconnect
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
        
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name
        )

    # Async method to get user from token
    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            from rest_framework.authtoken.models import Token
            token_instance = Token.objects.get(key=token)
            return token_instance.user
        except ObjectDoesNotExist:
            from django.contrib.auth.models import AnonymousUser
            return AnonymousUser()

    # Handler for 'user_vote_notification' event
    async def user_vote_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_vote_notification',
            'message': event['message'],
            'profile_picture': event.get('profile_picture', '')  ,
             'timestamp': event.get('timestamp', '')
        }))

# Handler for 'new_vote_notification' event
    async def new_vote_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_vote_notification',
            'message': event['message'],
            'option_id': event['option_id'],
            'agenda_id': event['agenda_id'],
            'profile_picture': event.get('profile_picture', '') ,
            'timestamp': event.get('timestamp', '')
        }))