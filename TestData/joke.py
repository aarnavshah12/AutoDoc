python
import random  # Import the random module to select a random joke

# Dictionary containing jokes as keys and their punchlines as values
jokes = {
    "Why did the scarecrow win an award?": "Because he was outstanding in his field.",
    "What do you call a lazy kangaroo?": "A pouch potato.",
    "Why did the bicycle fall over?": "Because it was two tired.",
}

def tell_joke():
    """
    Function to randomly select and print a joke from the jokes dictionary.
    """
    # Randomly select a joke and its punchline from the jokes dictionary
    joke, punchline = random.choice(list(jokes.items()))

    # Print the selected joke
    print(joke)

    # Print the punchline of the selected joke
    print(punchline)

# Call the tell_joke function to display a random joke
tell_joke()