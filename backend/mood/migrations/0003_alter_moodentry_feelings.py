import json
from django.db import migrations, models


def convert_feelings_to_json(apps, schema_editor):
    """Convert existing plain-text feelings values to JSON-encoded arrays."""
    with schema_editor.connection.cursor() as cursor:
        cursor.execute("SELECT id, feelings FROM mood_moodentry")
        rows = cursor.fetchall()
        updates = []
        for row_id, feelings_val in rows:
            try:
                parsed = json.loads(feelings_val)
                if isinstance(parsed, list):
                    continue  # already valid JSON list
                new_val = json.dumps([str(parsed)])
            except (json.JSONDecodeError, TypeError):
                if feelings_val and feelings_val.strip():
                    items = [f.strip() for f in feelings_val.split(',') if f.strip()]
                    new_val = json.dumps(items)
                else:
                    new_val = json.dumps([])
            updates.append((new_val, row_id))

        for new_val, row_id in updates:
            cursor.execute(
                "UPDATE mood_moodentry SET feelings = %s WHERE id = %s",
                [new_val, row_id],
            )


def revert_feelings_to_text(apps, schema_editor):
    """Reverse migration: JSON arrays back to comma-separated strings."""
    with schema_editor.connection.cursor() as cursor:
        cursor.execute("SELECT id, feelings FROM mood_moodentry")
        rows = cursor.fetchall()
        for row_id, feelings_val in rows:
            try:
                parsed = json.loads(feelings_val)
                new_val = ', '.join(parsed) if isinstance(parsed, list) else str(parsed)
            except (json.JSONDecodeError, TypeError):
                new_val = feelings_val or ''
            cursor.execute(
                "UPDATE mood_moodentry SET feelings = %s WHERE id = %s",
                [new_val, row_id],
            )


class Migration(migrations.Migration):

    dependencies = [
        ('mood', '0002_initial'),
    ]

    operations = [
        # Step 1: Convert existing text data to valid JSON arrays
        migrations.RunPython(convert_feelings_to_json, revert_feelings_to_text),
        # Step 2: Alter the column type to JSONField
        migrations.AlterField(
            model_name='moodentry',
            name='feelings',
            field=models.JSONField(default=list),
        ),
    ]
