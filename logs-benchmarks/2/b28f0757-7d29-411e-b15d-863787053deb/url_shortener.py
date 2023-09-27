import random
import string

# Dictionary to store the shortened URLs
url_dict = {}

# Function to shorten a given URL
def shorten_url(url):
    # Generate a random string of fixed length
    shortened_url = ''.join(random.choice(string.ascii_letters) for _ in range(5))
    # Store the original URL in the dictionary
    url_dict[shortened_url] = url
    return shortened_url

# Function to retrieve the original URL from a shortened URL
def retrieve_url(shortened_url):
    # Retrieve the original URL from the dictionary
    return url_dict.get(shortened_url, '')
