import requests
from bs4 import BeautifulSoup, NavigableString
import re
import numpy as np
import pandas as pd
from classifier import predict




keep = True
def random_negative():
	while (keep):
		article = requests.get("https://en.wikipedia.org/wiki/Special:Random")
		soup = BeautifulSoup(article.text,features="html.parser")

		first = soup.find_all('p')[0].get_text()
		first = re.sub(r'\([^)]*\)', '', first)

		find = re.compile(r"^[^.]*")
		first = re.search(find, first).group(0)
		if (len(first)>10 and len(first)<101):
			sentiment = predict(first)
			if (sentiment == "Negative"):
				result = False
				return (first,article.url)




