import hmac
import json
import os

from django.core.management import call_command
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


@csrf_exempt
@require_POST
def portfolio_demo(request):
    expected_secret = os.getenv("PORTFOLIO_SEED_SECRET", "")
    supplied_secret = request.headers.get("X-Portfolio-Seed-Secret", "")

    if not expected_secret or not hmac.compare_digest(supplied_secret, expected_secret):
        return JsonResponse({"detail": "Not found."}, status=404)

    try:
        payload = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "Request body must be valid JSON."}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"detail": "Request body must be a JSON object."}, status=400)

    action = payload.get("action", "seed")
    if action == "seed":
        call_command("seed_portfolio_demo")
        return JsonResponse({
            "status": "seeded",
            "username": "portfolio_demo",
            "password": "MoodTraceDemo!2026",
            "entries": 30,
        })
    if action == "remove":
        call_command("seed_portfolio_demo", remove=True)
        return JsonResponse({"status": "removed"})

    return JsonResponse({"detail": "action must be 'seed' or 'remove'."}, status=400)
