from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.userprofile.save()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance)

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Vote, Option, Agenda, OptionVoteCount, AgendaVoteCount

@receiver(post_save, sender=Vote)
def update_vote_counts_on_save(sender, instance, **kwargs):
    # Update Option vote count
    option_count, created = OptionVoteCount.objects.get_or_create(option=instance.option)
    option_count.vote_count = Vote.objects.filter(option=instance.option).count()
    option_count.save()
    
    # Update Agenda vote count
    agenda_count, created = AgendaVoteCount.objects.get_or_create(agenda=instance.agenda)
    agenda_count.vote_count = Vote.objects.filter(agenda=instance.agenda).count()
    agenda_count.save()

@receiver(post_delete, sender=Vote)
def update_vote_counts_on_delete(sender, instance, **kwargs):
    # Update Option vote count
    option_count, created = OptionVoteCount.objects.get_or_create(option=instance.option)
    option_count.vote_count = Vote.objects.filter(option=instance.option).count()
    option_count.save()

    # Update Agenda vote count
    agenda_count, created = AgendaVoteCount.objects.get_or_create(agenda=instance.agenda)
    agenda_count.vote_count = Vote.objects.filter(agenda=instance.agenda).count()
    agenda_count.save()

