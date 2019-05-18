import torch
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence
from torch.nn.utils.rnn import pad_sequence
import numpy as np
import pandas as pd

import spacy
import re

device = torch.device('cpu')


class Classifier(nn.Module):
    def __init__(self, dictionary_size, hidden_size, output_size=2):
        super(Classifier, self).__init__()
        self.hidden_size = hidden_size
        self.embedding = nn.Embedding(dictionary_size, hidden_size)
        self.gru = nn.GRU(hidden_size, hidden_size)
        self.lstm = nn.LSTM(hidden_size, hidden_size)
        self.linear = nn.Linear(hidden_size,output_size)

    def forward(self, pad_seqs, seq_lengths, hidden):
        
        batch_size = pad_seqs.shape[1]
        embedded = self.embedding(pad_seqs).view(pad_seqs.shape[0], pad_seqs.shape[1], -1)
        packed = pack_padded_sequence(embedded, seq_lengths, batch_first = False)
        self.lstm.flatten_parameters()
        _,hidden = self.lstm(packed)
        fc = self.linear(hidden[0])

        return fc

    def init_hidden(self, batch_size=1, device=device):
        return torch.zeros(1, batch_size, self.hidden_size, device=device)


hidden_size = 128
dictionary_size = 20000

classifier_filename = '../dl_project/classifier_model.pth'

classifier = Classifier(dictionary_size, hidden_size)
classifier.load_state_dict(torch.load(classifier_filename, map_location=lambda storage, loc: storage))
#print('Classifier loaded from %s.' % classifier_filename)
classifier = classifier.to(device)
classifier.eval()


word_df = pd.read_csv("../dl_project/data/words.csv",squeeze=True)
index_word = {x:y for x,y in enumerate(word_df["0"])}
word_index = {y:x for x,y in enumerate(word_df["0"])}

def indices_func(sentence):
    indices = [[[2]]]
    for word in nlp(cleanString(sentence)):
        try:
            indices.append([[word_index[word.text.lower()]]])
        except:
            indices.append([[1]])
            
    indices.append([[3]])
    return indices

def cleanString(s):
    s = s.lower().strip()
    s = re.sub(r"([.!?])", r" \1", s)
    s = re.sub(r"[^a-zA-Z.!?]+", r" ", s)
    return s

def replace(x):
    if (x==4): 
        return 1 
    else: 
        return x



nlp = spacy.load('en',disable=['parser', 'tagger', 'ner'])

def predict(sentence):




	indices = indices_func(cleanString(sentence))

	indices_tensor = torch.tensor(indices)
	lens = torch.tensor([len(indices)])
	init_hidden = classifier.init_hidden(1, device)
	output = classifier(indices_tensor, lens, init_hidden)

	final = output.detach().numpy().flatten()

	if (final[0]>final[1]):
	    return "Negative"
	else:
	    return"Positive"


