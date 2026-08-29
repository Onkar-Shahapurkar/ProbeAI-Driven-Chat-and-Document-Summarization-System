import { useState } from "react";
import {
  Video as VideoIcon,
  Upload,
  Sparkles,
  FileText,
} from "lucide-react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Video() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) return;

    setLoading(true);
    setError("");
    setTranscript("");
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/api/video/summarize",
        formData
      );

      setTranscript(response.data.transcript);
      setSummary(response.data.summary);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Video processing failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="video-page">

      <div className="video-header">
        <div>
          <p className="eyebrow">
            <VideoIcon size={14} />
            VIDEO INTELLIGENCE
          </p>

          <h1>Transform video into insights.</h1>

          <p>
            Upload a video and let ProbeAI extract,
            understand, and summarize its content.
          </p>
        </div>
      </div>

      <form
        className="video-upload"
        onSubmit={handleSubmit}
      >
        <input
          id="video-upload"
          type="file"
          accept=".mp4,.mov,.avi,.mkv,.webm"
          onChange={(event) =>
            setFile(event.target.files[0])
          }
        />

        <label htmlFor="video-upload">
          <Upload size={22} />

          <strong>
            {file
              ? file.name
              : "Drop your video here"}
          </strong>

          <span>
            MP4, MOV, AVI, MKV or WEBM
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !file}
        >
          <Sparkles size={17} />

          {loading
            ? "Processing..."
            : "Generate Summary"}
        </button>
      </form>

      {error && (
        <div className="video-error">
          {error}
        </div>
      )}

      {summary && (
        <section className="video-result">
          <div className="result-heading">
            <div className="result-icon">
              <Sparkles size={18} />
            </div>

            <div>
              <span>AI GENERATED</span>
              <h2>Video Summary</h2>
            </div>
          </div>

          <div className="summary-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
          </ReactMarkdown>
           </div>
        </section>
      )}

      {transcript && (
        <section className="video-result transcript">
          <div className="result-heading">
            <div className="result-icon">
              <FileText size={18} />
            </div>

            <div>
              <span>WHISPER TRANSCRIPTION</span>
              <h2>Transcript</h2>
            </div>
          </div>

          <p>{transcript}</p>
        </section>
      )}
    </div>
  );
}

export default Video;