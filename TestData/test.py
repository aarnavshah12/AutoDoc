python
import random

def knock_knock():
    """
    Function to simulate a "knock knock" joke interaction with the user.
    """

    # Dictionary containing the sequence of the joke
    jokes = {
        "Who's there?": "Interrupting cow.",
        "Interrupting cow who?": "Moo moo, I'm just here to tell a joke!",
    }

    # Randomly select a punchline from the jokes dictionary values
    punchline = random.choice(list(jokes.values()))

    # Iterate over the keys in the jokes dictionary
    for line in jokes.keys():
        print(line)  # Print the joke line
        response = input("> ")  # Get user response

        # Check if the user's response matches the joke line
        if response.lower() == line.lower():
            # Print the punchline and exit the loop
            print(punchline)
            break

# Call the function to start the knock knock joke
knock_knock()