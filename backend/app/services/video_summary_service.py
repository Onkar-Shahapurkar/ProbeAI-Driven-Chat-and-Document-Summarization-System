from app.services.ai_service import generate_response


async def summarize_transcript(transcript: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "You are ProbeAI. Summarize the following "
                "video transcript clearly and accurately. "
                "Include the main ideas and important details. "
                "Do not invent information."
            ),
        },
        {
            "role": "user",
            "content": transcript,
        },
    ]

    return await generate_response(messages)