from django.apps import AppConfig


class VotingappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'VotingApp'
    def ready(self):
        import VotingApp.signals
