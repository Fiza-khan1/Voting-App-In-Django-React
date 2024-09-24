from django.contrib import admin
from .models import UserProfile, Agenda, Option, Vote, OptionVoteCount, AgendaVoteCount

# Registering UserProfile model
admin.site.register(UserProfile)
admin.site.register(OptionVoteCount)
admin.site.register(AgendaVoteCount)

# Admin configuration for Agenda model
class AgendaAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'start_date', 'end_date']
    search_fields = ['name', 'description']
    list_filter = ['start_date', 'end_date']

admin.site.register(Agenda, AgendaAdmin)

# Admin configuration for Option model
class OptionAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'agenda_names', 'agenda_descriptions',
        'agenda_start_dates', 'agenda_end_dates'
    ]
    
    def agenda_names(self, obj):
        return ", ".join([agenda.name for agenda in obj.agendas.all()])

    def agenda_descriptions(self, obj):
        return ", ".join([agenda.description for agenda in obj.agendas.all()])

    def agenda_start_dates(self, obj):
        return ", ".join([agenda.start_date.strftime("%Y-%m-%d") for agenda in obj.agendas.all()])

    def agenda_end_dates(self, obj):
        return ", ".join([agenda.end_date.strftime("%Y-%m-%d") for agenda in obj.agendas.all()])

    # Optional: set column headers
    agenda_names.short_description = 'Agenda Names'
    agenda_descriptions.short_description = 'Agenda Descriptions'
    agenda_start_dates.short_description = 'Start Dates'
    agenda_end_dates.short_description = 'End Dates'


# Admin configuration for Vote model
class VoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'agenda', 'option']
    search_fields = ['user__username', 'agenda__name', 'option__name']
    list_filter = ['agenda', 'option']



admin.site.register(Option, OptionAdmin)

# Admin configuration for Vote model

admin.site.register(Vote)
