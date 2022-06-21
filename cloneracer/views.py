from django.http import JsonResponse
import openai
from django.conf import settings
from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
def generate_text(request):
    lang = request.GET.get('lang', '')

    if lang not in {'spanish', 'english'}:
        return JsonResponse({'error': 'Invalid language'}, status=400)

    openai.api_key = settings.OPENAI_API_KEY
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=f"a very short story in {lang}:",
        temperature=0.7,
        max_tokens=100
    )
    text = response['choices'][0]['text']
    text = text.strip().split('\n')[0]
    return JsonResponse({'text': text})

class HomePageView(TemplateView):
    template_name = 'main_menu.html'

class SingleRacerView(TemplateView):
    template_name = 'single_racer.html'