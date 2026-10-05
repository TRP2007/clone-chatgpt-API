from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3.8-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Student(BaseModel):
    id: int
    name: str


class Message(BaseModel):
    role: str
    content: str


class Prompt(BaseModel):
    text: str
    history: list[Message] = []


@app.get("/home")
def home():
    return {
        "message": "fastapi server is running"
    }


@app.post("/upload-data")
def upload_data(student: Student):
    print(student.id)
    print(student.name)


@app.post("/send-prompt")
def send_prompt(prompt: Prompt):

    history = []

    for message in prompt.history:
        history.append({
            "role": message.role,
            "parts": [message.content]
        })

    chat = model.start_chat(history=history)

    response = chat.send_message(prompt.text)

    return {
        "response": response.text
    }