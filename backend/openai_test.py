import os
import openai

openai.api_key = os.environ["OPENAI_API_KEY"]

start_sequence = "\nRichard Feynman:"
restart_sequence = "\nStranger: "

response = openai.Completion.create(
  engine="davinci",
  prompt="The following is a conversation between a stranger and Richard Feynman.\n\nStranger: Hello, who are you?" + start_sequence,
  temperature=0.5,
  max_tokens=150,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0.6,
  stop=["\n", "Stranger:", "Richard Feynman:"]
)

print(response)