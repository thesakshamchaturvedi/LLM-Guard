from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
import asyncio
import time
from typing import Dict, Optional

load_dotenv()

app = FastAPI(title="LLM-Guard AI Security Analyst")

# Enable CORS for frontend calls during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting storage
rate_limit_storage: Dict[str, list] = {}

# Pydantic model for input
class CodeInput(BaseModel):
    code_snippet: str
    language: str

# Pydantic model for output
class Vulnerability(BaseModel):
    line_number: int
    vulnerability_type: str
    risk_level: str
    description: str
    recommendation: str

class AnalysisSummary(BaseModel):
    risk_level: str
    assessment: str

class AnalysisResponse(BaseModel):
    summary: AnalysisSummary
    vulnerabilities: list[Vulnerability]

# Configure Google Gemini API client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY is None:
    print("FATAL ERROR: GEMINI_API_KEY environment variable not set")
    raise RuntimeError("GEMINI_API_KEY environment variable not set")
genai.configure(api_key=GEMINI_API_KEY)

# Rate limiting function
def check_rate_limit(client_ip: str, max_requests: int = 10, time_window: int = 60) -> bool:
    current_time = time.time()
    if client_ip not in rate_limit_storage:
        rate_limit_storage[client_ip] = []
    
    # Remove old requests outside the time window
    rate_limit_storage[client_ip] = [
        req_time for req_time in rate_limit_storage[client_ip]
        if current_time - req_time < time_window
    ]
    
    # Check if under the limit
    if len(rate_limit_storage[client_ip]) >= max_requests:
        return False
    
    # Add current request
    rate_limit_storage[client_ip].append(current_time)
    return True

SYSTEM_PROMPT = """
You are "LLM-Guard," an elite, world-class cybersecurity analyst and secure coding expert. Your purpose is to meticulously review code and configuration files for security vulnerabilities, misconfigurations, and deviations from best practices. You are hyper-vigilant and precise.

**Your Task:**
Analyze the user-provided snippet. Identify all potential security issues, ranging from critical vulnerabilities to subtle misconfigurations. For each issue you find, you MUST provide a detailed analysis.

**Output Constraints:**
You MUST respond ONLY with a single, valid JSON object. Do not include any introductory text, apologies, or explanations outside of the JSON structure. The JSON object must adhere to the following structure:

{
  "summary": {
    "risk_level": "Critical | High | Medium | Low | Informational",
    "assessment": "A brief, one-sentence summary of the security posture."
  },
  "vulnerabilities": [    {
      "line_number": <integer>,
      "vulnerability_type": "e.g., SQL Injection, Cross-Site Scripting (XSS), Insecure Deserialization, Hardcoded Secret, etc.",
      "risk_level": "Critical | High | Medium | Low",
      "description": "A clear, concise explanation of what the vulnerability is and why it is a risk in the context of the provided code.",
      "recommendation": "A specific, actionable recommendation on how to fix the issue. Provide a corrected code snippet whenever possible."
    }
  ]
}
"""

@app.get("/")
async def root():
    # Diagnostic log for the root endpoint
    print("Root endpoint '/' was hit!")
    return {"message": "Welcome to LLM-Guard AI Security Analyst"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_code(input: CodeInput):
    # Diagnostic log for the analyze endpoint
    print(f"'/analyze' endpoint hit with language: {input.language}")
    
    # Basic input validation
    if not input.code_snippet.strip():
        raise HTTPException(status_code=400, detail="Code snippet cannot be empty")
    
    if len(input.code_snippet) > 10000:
        raise HTTPException(status_code=400, detail="Code snippet too large (max 10,000 characters)")
    
    # Rate limiting (simplified - in production use proper client identification)
    client_ip = "default"  # In production, get actual client IP
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
    
    user_message = f"""Analyze the following {input.language} code for security vulnerabilities:\n```{input.language}\n{input.code_snippet}\n```"""
    
    try:
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        # Define safety settings to be permissive for a security analysis tool.
        # This is crucial to prevent the model from blocking responses containing
        # security vulnerability details, which it might otherwise flag as "dangerous".
        safety_settings = {
            genai.types.HarmCategory.HARM_CATEGORY_HARASSMENT: genai.types.HarmBlockThreshold.BLOCK_NONE,
            genai.types.HarmCategory.HARM_CATEGORY_HATE_SPEECH: genai.types.HarmBlockThreshold.BLOCK_NONE,
            genai.types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: genai.types.HarmBlockThreshold.BLOCK_NONE,
            genai.types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: genai.types.HarmBlockThreshold.BLOCK_NONE,
        }

        # FIX 1: Increased token limit to prevent truncated responses
        generation_config = {
            "max_output_tokens": 8192,
            "temperature": 0.2,
        }

        print("Sending request to Gemini API...")
        start_time = time.time()

        response = await model.generate_content_async(
            f"{SYSTEM_PROMPT}\n\n{user_message}",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        end_time = time.time()
        print(f"Received response from Gemini API in {end_time - start_time:.2f} seconds.")

        text_response = ""
        if not response.candidates:
            feedback = response.prompt_feedback if response.prompt_feedback else "No prompt feedback available."
            print(f"Gemini API did not return any candidates. Prompt feedback: {feedback}")
            raise ValueError("The analysis request was blocked by safety filters before generation could start.")

        candidate = response.candidates[0]
        
        if candidate.content and candidate.content.parts:
            for part in candidate.content.parts:
                if hasattr(part, 'text'):
                    text_response += part.text
        
        if not text_response:
            if candidate.finish_reason == 'SAFETY':
                print(f"Gemini API response was blocked due to safety settings. Ratings: {candidate.safety_ratings}")
                raise ValueError(f"The generated response was blocked by safety filters. Details: {candidate.safety_ratings}")
            else:
                print(f"Gemini API response contained no text content. Finish reason: {candidate.finish_reason}")
                raise ValueError("Gemini API response did not contain any text content for an unknown reason.")

        # Clean the response to extract just the JSON
        text_response = text_response.strip()
        if text_response.startswith('```json'):
            text_response = text_response[7:-3].strip()
        elif text_response.startswith('```'):
            text_response = text_response[3:-3].strip()
        
        # Parse JSON response from LLM
        result = json.loads(text_response)
        
        # Validate the response structure
        if not isinstance(result, dict) or 'summary' not in result or 'vulnerabilities' not in result:
            raise ValueError("Invalid response structure")
            
        print("Successfully parsed response and sending back to client.")
        return result
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Raw response text that caused error: {text_response}") # Added for debugging
        raise HTTPException(
            status_code=500, 
            detail="Failed to parse security analysis response from AI. Check server logs for details."
        )
    except ValueError as e: # Catch the specific ValueError for no text content
        print(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze code. Please try again later.")
