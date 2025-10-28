from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from googletrans import Translator
import spacy
from spacy import displacy
from openai import AzureOpenAI
import os
from dotenv import load_dotenv

translator = Translator()

# Set up the app
app = FastAPI()
# Basemodel basicially converts JSON to Python object
class TranslateRequest(BaseModel):
    # Define shape of JSON text
    text: str
    target: str = "en"
    source: str = "auto"

app.add_middleware(
    CORSMiddleware,
# Where can we use this 
    allow_origins = ["*"],
    allow_credentials = True,
# GET POST PUT DELETE methods
    allow_methods = ["*"],
    allow_headers = ["*"]
)

#   "original": req.text,
#   "translated": result.text,
#   "source_lang": result.src,
#   "target_lang": result.dest

# Both our function and Translator() are async

@app.post("/translate")
async def TranslationFunction(req: TranslateRequest) -> dict:
    # Translate the text
    result = await translator.translate(req.text, dest = req.target, src = req.source)
     # Original is the req, result is the new
    return{
          "original": req.text,
          "translated": result.text,
          "source_lang": result.src,
          "target_lang": result.dest
        }

# Now load in the definitions for the words

nlp = spacy.load("en_core_web_sm")   
doc = nlp("He has an apple")
lemmas = []
displacy.render(doc, style = "dep")

# SPACY_MODELS = {
#     "en": "en_core_web_sm",
#     "de": "de_core_news_sm",
#     "es": "es_core_news_sm",
#     "fr": "fr_core_news_sm",
#     "it": "it_core_news_sm",
#     "ja": "ja_core_news_sm",
#     "pt": "pt_core_news_sm",
#     "nl": "nl_core_news_sm",
# }

class WordDefinition(BaseModel):
    word: str
    lang: str

@app.post("/defineword")
def define_word(req: WordDefinition):
    load_dotenv()

    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION")
    )

    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    prompt = f'''
    Give me a simple definition and 2 synonyms of this word {req.word}. Put the definition and 2 synonyms in a JSON format in the same language as the word. 
    But don't give me the actual word. This JSON should have key value pairs
    The first key-value pair is worddef: and then the definition. 
    The second key-value pair is synonyms: then a list of synonyms.  
    For the same word, give the exact same definition. Make sure to make the definition super duper accurate
    Everything, I mean the worddef and synonyms must be in this language {req.lang}.
    '''

    response = client.chat.completions.create(
    model = deployment,
    messages = [
        {
    "role": "user", "content": prompt
    }])
    
    help_response = response.choices[0].message.content
    return{
        "definition" : help_response
    }


class GiveWordDetails(BaseModel):
    word: str
    target: str
    source: str
    sentence: str


@app.post("/worddefinition")
async def word_details(req: GiveWordDetails):
    nlp = spacy.load(f'{req.target}_core_web_sm')
    # Turn into tokens
    doc = nlp(req.word)
    tokens = [{
        # Dependency (Subject, object)
        "dep": token.dep,
        # Part of speech
        "pos": token.pos_
    }   
    for token in doc
    ]
    full_word_diagram = nlp(req.sentence)
    word_trans = await translator.translate(req.word, dest = req.target, src = req.source)
    # .sents breaks the whole text up into sentences
    # Generate diagram for every sentence because only one sentence can be handled at a time
    html_sentences = [displacy.render(sentence, style = "dep", page = False)               
        for sentence in full_word_diagram.sents
    ]

    return{
        "wordTranslation": word_trans.text,
        "tokens": tokens,
        "html": "".join(html_sentences)
    }

# Word to flashcards translator time

class sendTranscriptToAI(BaseModel):
    transcription: str
    lang_from: str
    lang_to: str
    pos: str
    amount: int
    user_wants: str

@app.post("/createflashcards")
async def create_flashcards(req: sendTranscriptToAI):
    load_dotenv()

    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION")
    )

    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

    prompt = f"""
    Create simple word-to-word flashcards from the following text.
    Output must be a valid JSON array of objects, each with "word from the source language" and "translation from the target language".
    Make sure this is a list of dictionaries!
    Instructions:
    1. One word per flashcard.
    2. No extra explanations or examples.
    3. Number the flashcards in the JSON order.
    4. Source language: {req.lang_from}
    5. Target language: {req.lang_to}
    6. Part of speech focus: {req.pos} (if applicable)
    7. Amount of flashcards: {req.amount}

    Text:
    {req.transcription}

    Here is additional things that the user may want:
    {req.user_wants}
    If the user requests more flashcards than given in the transcript, just make the most that you can without repeating. 
    But try to do the amount of flashcards that the user requests
    """
    
    response = client.chat.completions.create(
    model = deployment,
    messages = [
        {
    "role": "user", "content": prompt
    }])
    
    flashcards = response.choices[0].message.content
    return{
        "flashcards": flashcards,
        "partofspeech": req.pos
    }

class askAI(BaseModel):
    question: str

@app.post("/askAI")
async def ask_the_AI(req: askAI):
    load_dotenv()

    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION")
    )

    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    prompt = f'''
    You are a highly skilled language teacher who provides clear explanations and helpful YouTube resources for students learning any language. 
    Answer the student’s question clearly and thoroughly, using simple, easy-to-understand language. The student’s question is: {req.question}.
    When providing additional resources, include an actual, relevant link to a language website that will help the student understand the topic. 
    Make sure the language website ends with .com, but never put duolingo on there. When you put the link, make sure after the .com it ends with a period.
    '''

    response = client.chat.completions.create(
    model = deployment,
    messages = [
        {
    "role": "user", "content": prompt
    }])
    
    help_response = response.choices[0].message.content
    return{
        "chatresponse" : help_response
    }

