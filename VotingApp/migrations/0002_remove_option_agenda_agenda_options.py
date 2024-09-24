# Generated by Django 5.1.1 on 2024-09-23 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('VotingApp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='option',
            name='agenda',
        ),
        migrations.AddField(
            model_name='agenda',
            name='options',
            field=models.ManyToManyField(related_name='agendas', to='VotingApp.option'),
        ),
    ]
