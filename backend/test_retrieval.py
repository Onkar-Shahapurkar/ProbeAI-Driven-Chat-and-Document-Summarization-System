from app.services.retrieval_service import (
    split_into_chunks,
    retrieve_relevant_chunks,
)


text = """
Artificial intelligence is a field of computer science
that focuses on creating intelligent machines.

Machine learning is a subset of artificial intelligence
where systems learn patterns from data.

Deep learning uses neural networks with multiple layers
to learn complex patterns.
"""

chunks = split_into_chunks(
    text,
    chunk_size=30,
    overlap=5,
)

results = retrieve_relevant_chunks(
    "What is machine learning?",
    chunks,
    top_k=2,
)

for chunk, score in results:
    print("=" * 50)
    print(f"Score: {score:.4f}")
    print(chunk)