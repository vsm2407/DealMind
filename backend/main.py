import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hindsight_client import Hindsight

# Load environment variables
load_dotenv()

# Get Hindsight API key
API_KEY = os.getenv("HINDSIGHT_API_KEY")

if not API_KEY:
    raise ValueError("HINDSIGHT_API_KEY not found in .env")

# Create Hindsight client
hindsight = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=API_KEY
)

BANK_ID = "dealmind"
class Interaction(BaseModel):
    content: str

# Create FastAPI application
app = FastAPI(
    title="DealMind API",
    description="AI Sales Intelligence Agent powered by Hindsight",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load deal data
with open("deals.json", "r", encoding="utf-8") as file:
    deals = json.load(file)


@app.get("/")
def root():
    return {
        "message": "DealMind API is running",
        "hindsight": "connected",
        "memory_bank": BANK_ID
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "DealMind",
        "hindsight": "connected"
    }


@app.get("/api/deals")
def get_deals():
    return {
        "count": len(deals),
        "deals": deals
    }


@app.get("/api/deals/{deal_id}")
def get_deal(deal_id: int):
    for deal in deals:
        if deal["id"] == deal_id:
            return deal

    raise HTTPException(
        status_code=404,
        detail="Deal not found"
    )

@app.post("/api/deals/{deal_id}/interactions")
def add_interaction(deal_id: int, interaction: Interaction):

    # Find the deal
    deal = None

    for item in deals:
        if item["id"] == deal_id:
            deal = item
            break

    if not deal:
        raise HTTPException(
            status_code=404,
            detail="Deal not found"
        )

    # Create a memory containing the deal context
    memory = (
        f"Deal interaction for {deal['company']}. "
        f"Industry: {deal['industry']}. "
        f"Deal stage: {deal['stage']}. "
        f"Decision maker: {deal['decision_maker']}. "
        f"Competitor: {deal['competitor']}. "
        f"New customer interaction: {interaction.content}"
    )

    # Store the interaction in Hindsight
    hindsight.retain(
        bank_id=BANK_ID,
        content=memory
    )

    return {
        "message": "Interaction stored successfully",
        "deal": deal["company"],
        "memory_stored": True,
        "interaction": interaction.content
    }
@app.get("/api/deals/{deal_id}/memories")
def get_memories(deal_id: int):

    # Find the deal
    deal = None

    for item in deals:
        if item["id"] == deal_id:
            deal = item
            break

    if not deal:
        raise HTTPException(
            status_code=404,
            detail="Deal not found"
        )

    # Ask Hindsight to recall relevant memories
    result = hindsight.recall(
        bank_id=BANK_ID,
        query=(
            f"What do we know about {deal['company']}? "
            f"Include their concerns, decision maker, competitors, "
            f"preferences, previous interactions, and important deal context."
        )
    )

    memories = []

    for memory in result.results:
        memories.append(memory.text)

    return {
        "deal": deal["company"],
        "memory_count": len(memories),
        "memories": memories
    }
@app.get("/api/deals/{deal_id}/prepare")
def prepare_meeting(deal_id: int):

    # Find the deal
    deal = None

    for item in deals:
        if item["id"] == deal_id:
            deal = item
            break

    if not deal:
        raise HTTPException(
            status_code=404,
            detail="Deal not found"
        )

    # Ask Hindsight to reason over the deal's memories
    response = hindsight.reflect(
        bank_id=BANK_ID,
        query=(
            f"Prepare me for my next meeting with {deal['company']}. "
            f"Give me a concise sales meeting brief. "
            f"Include: current deal situation, key decision maker, "
            f"main customer concerns, competitors mentioned, "
            f"what the customer liked, pricing concerns, "
            f"what I should focus on in the meeting, "
            f"and specific recommended talking points. "
            f"Only use information supported by the memories."
        )
    )

    return {
        "deal": deal["company"],
        "meeting_brief": response.text,
        "memories_used": len(response.based_on or [])
    }