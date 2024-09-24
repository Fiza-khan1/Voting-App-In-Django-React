from django.db import models
from django.contrib.auth.models import User
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to the default User model
    bio = models.TextField(blank=True, null=True)  # Optional biography field
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)  # Optional profile picture field

    def __str__(self):
        return self.user.username


# agenda/models.py
from django.db import models

# class Agenda(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     start_date = models.DateField()
#     end_date = models.DateField()
    
#     def __str__(self):
#         return self.name
# class Option(models.Model):
#     agenda = models.ForeignKey(Agenda, related_name='options', on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     def __str__(self):
#         return self.name

# models.py

from django.db import models


from django.db import models

class Option(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Agenda(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    options = models.ManyToManyField(Option, related_name='agendas')

    def __str__(self):
        return self.name


from django.contrib.auth.models import User

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    agenda = models.ForeignKey(Agenda, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('user', 'agenda')  # Ensure a user can vote only once per agenda

    def __str__(self):
        return f'{self.user} voted for {self.option} in {self.agenda}'



class OptionVoteCount(models.Model):
    option = models.OneToOneField(Option, on_delete=models.CASCADE)
    vote_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.option.name} - Votes: {self.vote_count}"

class AgendaVoteCount(models.Model):
    agenda = models.OneToOneField(Agenda, on_delete=models.CASCADE)
    vote_count = models.PositiveIntegerField(default=0)
    def __str__(self):
        return f"{self.agenda.name} - Votes: {self.vote_count}"