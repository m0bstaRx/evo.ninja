
////////////////////////////////////////////

Trying to achieve goal: Build a basic URL shortener using a python CLI. Here are the specifications.

Functionality: The program should have two primary functionalities.

Shorten a given URL.
Retrieve the original URL from a shortened URL.

CLI: The command-line interface should accept a URL as its first input. It should be able to determine if the url is a shortened url or not. If the url is not shortened, it will display ONLY the shortened url, otherwise, it will display ONLY the original unshortened URL. Afterwards, it should prompt the user for another URL to process.

Technical specifications:
Build a file called url_shortener.py. This file will be called through command lines.

Edge cases:
For the sake of simplicity, there will be no edge cases, you can assume the input is always correct and the user immediately passes the shortened version of the url he just shortened.

You will be expected to create a python file called url_shortener.py that will run through command lines by using python url_shortener.py.

The url_shortener.py will be tested this way:
```
import unittest
from url_shortener import shorten_url, retrieve_url

class TestURLShortener(unittest.TestCase):
    def test_url_retrieval(self):
        # Shorten the URL to get its shortened form
        shortened_url = shorten_url('https://www.example.com')

        # Retrieve the original URL using the shortened URL directly
        retrieved_url = retrieve_url(shortened_url)

        self.assertEqual(retrieved_url, 'https://www.example.com', "Retrieved URL does not match the original!")

if __name__ == "__main__":
    unittest.main()
```
Task with ID: b28f0757-7d29-411e-b15d-863787053deb

Creating script 'python.createFile'...
  


Thinking...

Failed to execute writeFunction!

Running step....

Running step....

Creating script 'python.createFile'...
  


Thinking...

Failed to execute writeFunction!

Running step....

FS.WRITE = url_shortener.py
  


Running step....

The Python file 'url_shortener.py' has been created successfully.
  


Running step....

Goal has been achieved!
  


Running step....

{"type":"success","title":"Executed 'agent.onGoalAchieved' script.","content":"## Function Call:\n```javascript\nexecuteScript({\n  \"namespace\": \"agent.onGoalAchieved\",\n  \"arguments\": \"{}\",\n  \"result\": \"\"\n})\n```\n## Result\n```\nJSON result: \n```\ntrue\n```\n\n```"}

Task is done - Removing generated scripts...

////////////////////////////////////////////


