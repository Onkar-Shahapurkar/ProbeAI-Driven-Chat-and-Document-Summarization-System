from app.services.video_service import transcribe_video


text = transcribe_video("sample-ai.mp4")

print(text)