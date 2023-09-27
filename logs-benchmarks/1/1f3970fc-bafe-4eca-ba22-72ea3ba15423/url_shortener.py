import hashlib

# Store the URLs
url_dict = {}

def shorten_url(original_url):
    # Create a hash of the original URL
    shortened_url = hashlib.md5(original_url.encode()).hexdigest()[:10]
    # Store the original URL with the hash as the key
    url_dict[shortened_url] = original_url
    return shortened_url

def retrieve_url(shortened_url):
    # Retrieve the original URL using the hash
    return url_dict.get(shortened_url, '')
