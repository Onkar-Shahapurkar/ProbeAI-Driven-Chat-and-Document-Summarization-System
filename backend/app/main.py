from fastapi import FastAPI

app = FastAPI(title="ProbeAI API")


@app.get("/")
def root():
    return {
        "message": "ProbeAI API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }