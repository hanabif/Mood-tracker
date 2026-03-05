import csv
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from datetime import date
import json

class MoodEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MoodEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MoodEntry.objects.filter(user=self.request.user)
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        entry_date = self.request.query_params.get('date')
        if entry_date:
            queryset = queryset.filter(date=entry_date)

        return queryset.order_by('date')

    def perform_create(self, serializer):
        today = date.today()
        existing = MoodEntry.objects.filter(user=self.request.user, date=today).first()
        if existing:
            # Update existing entry (allows re-logging same day)
            serializer = MoodEntrySerializer(existing, data=self.request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return
        serializer.save(user=self.request.user, date=today)

    def create(self, request, *args, **kwargs):
        today = date.today()
        existing = MoodEntry.objects.filter(user=request.user, date=today).first()
        if existing:
            serializer = MoodEntrySerializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, date=today)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def export_data(self, request):
        format = request.query_params.get('format', 'json')
        entries = self.get_queryset()

        if format == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="mood_data.csv"'
            writer = csv.writer(response)
            writer.writerow(['date', 'mood', 'sleep_hours', 'feelings', 'reflection'])
            for e in entries:
                writer.writerow([e.date, e.mood, e.sleep_hours, json.dumps(e.feelings), e.reflection])
            return response
        else:
            serializer = self.get_serializer(entries, many=True)
            return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        entries = self.get_queryset().filter(reflection__icontains=query)
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)
