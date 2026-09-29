import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

API_KEY = os.getenv("HINDSIGHT_API_KEY")

if not API_KEY:
    raise ValueError("HINDSIGHT_API_KEY not found in .env")

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=API_KEY
)

BANK_ID = "dealmind"

print("Connecting to Hindsight...")
print("Memory bank:", BANK_ID)

# Store our first DealMind memory
client.retain(
    bank_id=BANK_ID,
    content=(
        "TechNova is a healthcare company. "
        "Their CTO is the primary decision maker. "
        "The customer is concerned about migration complexity "
        "and is comparing our product with Salesforce. "
        "They liked our analytics dashboard."
    )
)

print("✅ Memory successfully stored!")

# Retrieve the memory
result = client.recall(
    bank_id=BANK_ID,
    query="What do we know about TechNova, especially their concerns and decision maker?"
)

print("\n🔎 Memories retrieved:\n")

for memory in result.results:
    print("-", memory.text)

client.close()

print("\n✅ HINDSIGHT CONNECTION TEST PASSED!")