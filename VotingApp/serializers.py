from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Option,Agenda
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import Agenda, Option
from rest_framework import serializers
from django.utils import timezone
from .models import Agenda, Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'name']

class AgendaSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, required=False)

    class Meta:
        model = Agenda
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'options']

    def validate(self, data):
        # Validate start_date and end_date
        if data['start_date'] < timezone.now().date():
            raise serializers.ValidationError({'start_date': 'Start date cannot be in the past.'})
        if data['end_date'] < timezone.now().date():
            raise serializers.ValidationError({'end_date': 'End date cannot be in the past.'})
        return data

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        agenda = Agenda.objects.create(**validated_data)

        # After creating the Agenda, add the options to the many-to-many field
        for option_data in options_data:
            option = Option.objects.create(**option_data)
            agenda.options.add(option)  # Use the add method for ManyToManyField

        return agenda

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', [])
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.save()

        # Clear old options and add new ones
        instance.options.all().delete()
        for option_data in options_data:
            Option.objects.create(agenda=instance, **option_data)
        return instance
class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already taken')
        return value
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# Serializer for user login
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        return {
            'user': user
        }


from .models import UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    is_superuser = serializers.BooleanField(source='user.is_superuser', read_only=True)  # Add superuser status

    class Meta:
        model = UserProfile
        fields = ['id', 'bio', 'profile_picture', 'user', 'username', 'email', 'is_superuser']  # Include is_superuser

# agenda/serializers.py
from .models import Agenda, Option

from rest_framework import serializers
from .models import Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'name', 'agenda']
        # extra_kwargs = {'agenda': {'read_only': True}} # Ensure 'agenda' is included



# VotingApp/serializers.py

from rest_framework import serializers
from .models import Vote, OptionVoteCount, AgendaVoteCount

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['user', 'agenda', 'option']

from rest_framework import serializers
from .models import OptionVoteCount, AgendaVoteCount
class OptionVoteCountSerializer(serializers.ModelSerializer):
    option_name = serializers.CharField(source='option.name', read_only=True)
    agenda_title = serializers.CharField(source='option.agenda.name', read_only=True)  # Make sure to access option.agenda

    class Meta:
        model = OptionVoteCount
        fields = ['option_name', 'agenda_title', 'vote_count']
# class OptionVoteCountSerializer(serializers.ModelSerializer):
#     option_name = serializers.CharField(source='option.name', read_only=True)
#     agenda_title = serializers.CharField(source='option.agenda.name', read_only=True)
#     agenda_description = serializers.CharField(source='option.agenda.description', read_only=True)

#     class Meta:
#         model = OptionVoteCount
#         fields = ['option_name', 'agenda_title', 'agenda_description', 'vote_count']


class AgendaVoteCountSerializer(serializers.ModelSerializer):
    agenda_name = serializers.CharField(source='agenda.name', read_only=True)
    agenda_description = serializers.CharField(source='agenda.description', read_only=True)

    class Meta:
        model = AgendaVoteCount
        fields = ['agenda_name', 'agenda_description', 'vote_count']

