from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from mood.models import MoodEntry
from user.models import CustomUser


DEMO_USERNAME = "portfolio_demo"
DEMO_PASSWORD = "MoodTraceDemo!2026"

DEMO_ENTRIES = [
    (5, ["grateful", "calm"], "Started the day slowly and made time for a walk. I felt present and grateful." , 8.0),
    (4, ["focused", "motivated"], "Made steady progress on a project. Taking short breaks helped me stay focused.", 7.5),
    (3, ["tired", "hopeful"], "A full day with a few stressful moments, but I handled them better than I expected.", 6.0),
    (4, ["connected", "happy"], "Had a good conversation with a friend and felt more connected afterward.", 7.0),
    (2, ["anxious", "overwhelmed"], "There was a lot to do today. Writing down the next small step made it feel manageable.", 5.5),
    (4, ["relieved", "calm"], "Finished an important task and gave myself permission to rest this evening.", 7.5),
    (5, ["joyful", "energetic"], "Spent time outside and enjoyed a quiet, refreshing afternoon.", 8.0),
    (3, ["reflective", "tired"], "My energy dipped in the afternoon, so I took a break and adjusted my plans.", 6.5),
    (4, ["proud", "motivated"], "Kept a promise I made to myself and felt proud of following through.", 7.0),
    (2, ["sad", "thoughtful"], "Today felt difficult. I reached out to someone I trust instead of keeping it to myself.", 6.0),
    (4, ["peaceful", "grateful"], "A simple routine and an early night helped me feel more balanced.", 8.5),
    (5, ["happy", "confident"], "Had a lovely day with people I care about and felt comfortable being myself.", 7.5),
    (3, ["uncertain", "focused"], "I felt unsure about a decision, so I listed what matters most and took my time.", 6.5),
    (4, ["relaxed", "content"], "Made space for a hobby after work. It was nice to enjoy something without rushing.", 7.5),
    (3, ["busy", "hopeful"], "The schedule was packed, but I remembered to pause for lunch and reset.", 6.0),
    (5, ["accomplished", "energized"], "Reached a milestone I have been working toward. I celebrated with a favorite meal.", 8.0),
    (2, ["frustrated", "tired"], "Plans changed unexpectedly. A short walk helped me clear my head.", 5.5),
    (4, ["supported", "calm"], "Asked for help with something I had been carrying alone and felt supported.", 7.0),
    (3, ["thoughtful", "steady"], "An ordinary day. I noticed that keeping a consistent routine made things easier.", 7.0),
    (5, ["optimistic", "grateful"], "Woke up rested and felt optimistic about the week ahead.", 8.5),
    (4, ["creative", "engaged"], "Got absorbed in a creative task and enjoyed the process more than the outcome.", 7.5),
    (3, ["stressed", "resilient"], "A challenging conversation took energy, but I stayed grounded and expressed myself clearly.", 6.0),
    (4, ["content", "relaxed"], "Kept the evening simple: dinner, a little reading, and an early bedtime.", 7.5),
    (5, ["joyful", "connected"], "Shared a meal with family and came away feeling warm and connected.", 8.0),
    (3, ["low-energy", "patient"], "I had less energy than usual, so I lowered my expectations and focused on the essentials.", 6.5),
    (4, ["confident", "focused"], "Made a clear plan for the day and felt good about the progress I made.", 7.0),
    (2, ["worried", "reflective"], "I spent time worrying about the future. Journaling helped me separate what I can control.", 6.0),
    (4, ["hopeful", "calm"], "Noticed a small improvement in my routine and want to keep building on it.", 7.5),
    (5, ["peaceful", "thankful"], "A restful day with no rush. I feel thankful for the people and routines that support me.", 8.5),
    (4, ["balanced", "motivated"], "Wrapped up the month feeling more aware of my needs and ready to keep checking in.", 7.5),
]


class Command(BaseCommand):
    help = "Create or remove the local portfolio demo account and mood history."

    def add_arguments(self, parser):
        parser.add_argument(
            "--remove",
            action="store_true",
            help="Delete the portfolio demo account and its mood entries.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        user = CustomUser.objects.filter(username=DEMO_USERNAME).first()

        if options["remove"]:
            if user:
                if user.email != "portfolio-demo@example.invalid":
                    raise CommandError(
                        f"Refusing to remove {DEMO_USERNAME}: it is not marked as the portfolio demo account."
                    )
                user.delete()
                self.stdout.write(self.style.SUCCESS("Portfolio demo account and entries removed."))
            else:
                self.stdout.write("Portfolio demo account was not found; nothing to remove.")
            return

        if user is None:
            user = CustomUser(username=DEMO_USERNAME)
        elif user.email != "portfolio-demo@example.invalid":
            raise CommandError(
                f"Refusing to overwrite {DEMO_USERNAME}: that username belongs to a different account."
            )
        user.name = "MoodTrace Portfolio Demo"
        user.email = "portfolio-demo@example.invalid"
        user.is_active = True
        user.set_password(DEMO_PASSWORD)
        user.save()

        today = timezone.localdate()
        for days_ago, (mood, feelings, reflection, sleep_hours) in enumerate(DEMO_ENTRIES):
            entry_date = today - timedelta(days=days_ago)
            MoodEntry.objects.update_or_create(
                user=user,
                date=entry_date,
                defaults={
                    "mood": mood,
                    "feelings": feelings,
                    "reflection": reflection,
                    "sleep_hours": sleep_hours,
                },
            )

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(DEMO_ENTRIES)} entries for {DEMO_USERNAME}."
        ))
        self.stdout.write(f"Demo password: {DEMO_PASSWORD}")
        self.stdout.write("Remove later with: python manage.py seed_portfolio_demo --remove")
