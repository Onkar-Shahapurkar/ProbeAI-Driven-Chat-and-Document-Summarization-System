from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def split_into_chunks(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 200,
) -> list[str]:
    words = text.split()

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size

        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


def retrieve_relevant_chunks(
    query: str,
    chunks: list[str],
    top_k: int = 3,
) -> list[tuple[str, float]]:

    if not chunks:
        return []

    documents = [query] + chunks

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    matrix = vectorizer.fit_transform(documents)

    query_vector = matrix[0]
    chunk_vectors = matrix[1:]

    similarities = cosine_similarity(
        query_vector,
        chunk_vectors,
    )[0]

    ranked_indices = similarities.argsort()[::-1]

    results = []

    for index in ranked_indices[:top_k]:
        results.append(
            (
                chunks[index],
                float(similarities[index]),
            )
        )

    return results

def retrieve_from_document(
    query: str,
    document_text: str,
    top_k: int = 3,
) -> list[tuple[str, float]]:
    chunks = split_into_chunks(document_text)

    return retrieve_relevant_chunks(
        query=query,
        chunks=chunks,
        top_k=top_k,
    )