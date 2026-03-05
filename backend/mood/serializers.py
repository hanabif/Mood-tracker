from rest_framework import serializers
from .models import MoodEntry

class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = ['id', 'user', 'date', 'mood', 'feelings', 'reflection', 'sleep_hours', 'created_at']
        read_only_fields = ('user', 'date', 'created_at')
