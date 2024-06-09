
import random  

jokes = {
    "Why did the scarecrow win an award?": "Because he was outstanding in his field.",
    "What do you call a lazy kangaroo?": "A pouch potato.",
    "Why did the bicycle fall over?": "Because it was two tired.",
}

def tell_joke():

    
    joke, punchline = random.choice(list(jokes.items()))

    print(joke)

    print(punchline)

tell_joke()