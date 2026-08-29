from app.services.ai_service import generate_response
from app.services.retrieval_service import retrieve_from_document


async def answer_from_document(
    question: str,
    document_text: str,
) -> tuple[str, list[dict]]:

    results = retrieve_from_document(
        query=question,
        document_text=document_text,
        top_k=3,
    )

    relevant_chunks = [
        chunk
        for chunk, score in results
        if score > 0
    ]

    if not relevant_chunks:
        return (
            "I couldn't find relevant information in "
            "the uploaded document.",
            [],
        )

    context = "\n\n---\n\n".join(relevant_chunks)

    messages = [
        {
            "role": "system",
            "content": (
                "You are ProbeAI. Answer the user's question "
                "using ONLY the provided document context. "
                "If the answer cannot be found in the context, "
                "say that the information is not available "
                "in the document. Do not invent information."
            ),
        },
        {
            "role": "user",
            "content": (
                f"DOCUMENT CONTEXT:\n\n{context}\n\n"
                f"QUESTION:\n{question}"
            ),
        },
    ]

    answer = await generate_response(messages)

    sources = [
        {
            "text": chunk,
            "score": score,
        }
        for chunk, score in results
        if score > 0
    ]

    return answer, sources