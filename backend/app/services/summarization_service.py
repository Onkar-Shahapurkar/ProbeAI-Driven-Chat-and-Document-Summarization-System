from app.services.ai_service import generate_response
from app.services.retrieval_service import split_into_chunks


async def summarize_document(
    document_text: str,
) -> str:

    chunks = split_into_chunks(
        document_text,
        chunk_size=2000,
        overlap=200,
    )

    chunk_summaries = []

    for chunk in chunks:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are ProbeAI. Summarize the provided "
                    "document section accurately. Keep the "
                    "important facts, ideas, and details."
                ),
            },
            {
                "role": "user",
                "content": chunk,
            },
        ]

        summary = await generate_response(messages)
        chunk_summaries.append(summary)

    combined = "\n\n---\n\n".join(chunk_summaries)

    final_messages = [
        {
            "role": "system",
            "content": (
                "You are ProbeAI. Create a concise, coherent "
                "final summary from the provided section "
                "summaries. Do not invent information."
            ),
        },
        {
            "role": "user",
            "content": combined,
        },
    ]

    return await generate_response(final_messages)