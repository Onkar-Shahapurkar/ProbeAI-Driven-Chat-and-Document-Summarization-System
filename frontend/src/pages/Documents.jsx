import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);


  async function loadDocuments() {
    try {
      const response = await api.get("/api/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleUpload(event) {
    event.preventDefault();

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post(
        "/api/documents/upload",
        formData
      );

      setFile(null);
      await loadDocuments();
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function askQuestion(event) {
    event.preventDefault();

    if (!selectedDocument || !question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");
    setSources([]);
    setError("");

    try {
      const response = await api.post(
        `/api/documents/${selectedDocument.id}/ask`,
        {
          question: question.trim(),
        }
      );

      setAnswer(response.data.answer);
      setSources(response.data.sources || []);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to answer the question."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="documents-page">

        <div className="documents-header">
        <div>
            <p className="eyebrow">
            <FileText size={14} />
            DOCUMENT INTELLIGENCE
            </p>

            <h1>Your Documents</h1>

            <p>
            Upload documents, summarize them, and
            ask questions using AI-powered retrieval.
            </p>
        </div>

        <form
            className="upload-box"
            onSubmit={handleUpload}
        >
            <input
            id="document-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) =>
                setFile(event.target.files[0])
            }
            />

            <label htmlFor="document-upload">
            Choose document
            </label>

            <button
            type="submit"
            disabled={uploading || !file}
            >
            {uploading
                ? "Uploading..."
                : "Upload"}
            </button>
        </form>
        </div>

        {error && (
        <div className="document-error">
            {error}
        </div>
        )}

        <div className="documents-layout">

        <section className="documents-list">
            <div className="section-heading">
            <h2>Uploaded Documents</h2>
            <span>{documents.length}</span>
            </div>

            {documents.length === 0 ? (
            <div className="empty-documents">
                <FileText size={30} />
                <h3>No documents yet</h3>
                <p>
                Upload your first document to get started.
                </p>
            </div>
            ) : (
            documents.map((document) => (
                <div
                    key={document.id}
                    className={`document-card ${
                        selectedDocument?.id === document.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                        setSelectedDocument(document)
                    }
                    >
                    <div className="document-icon">
                        <FileText size={19} />
                    </div>

                    <div className="document-info">
                        <strong>
                        {document.original_filename}
                        </strong>

                        <span>
                        {document.file_type.toUpperCase()}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="delete-document-button"
                        onClick={(event) => {
                        event.stopPropagation();
                        deleteDocument(document.id);
                        }}
                    >
                        <Trash2 size={15} />
                    </button>
                    </div>
            ))
            )}
        </section>

        <section className="document-workspace">

            {!selectedDocument ? (
            <div className="document-placeholder">
                <div className="document-placeholder-icon">
                <Sparkles size={28} />
                </div>

                <h2>Select a document</h2>

                <p>
                Choose a document from the left to
                summarize it or ask questions.
                </p>
            </div>
            ) : (
            <>
                <div className="selected-document-header">
                <div>
                    <span>SELECTED DOCUMENT</span>
                    <h2>
                    {selectedDocument.original_filename}
                    </h2>
                </div>

                <button
                    className="summarize-button"
                    onClick={summarizeDocument}
                    disabled={summarizing}
                >
                    <Sparkles size={16} />
                    {summarizing
                    ? "Summarizing..."
                    : "Summarize"}
                </button>
                </div>

                {summary && (
                <div className="summary-panel">
                    <div className="panel-label">
                    <Sparkles size={15} />
                    AI SUMMARY
                    </div>

                    <div className="summary-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summary}
                    </ReactMarkdown>
                    </div>
                </div>
                )}

                <form
                className="document-question"
                onSubmit={askQuestion}
                >
                <input
                    value={question}
                    onChange={(event) =>
                    setQuestion(event.target.value)
                    }
                    placeholder="Ask something about this document..."
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                    ? "..."
                    : "Ask"}
                </button>
                </form>

                {answer && (
                    <div className="document-answer">
                        <div className="panel-label">
                        <Sparkles size={15} />
                        PROBEAI
                        </div>

                        <div className="answer-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {answer}
                        </ReactMarkdown>
                        </div>

                        {sources.length > 0 && (
                        <div className="document-sources">
                            <div className="panel-label">
                            <FileText size={15} />
                            SOURCES
                            </div>

                            {sources.map((source, index) => (
                            <div
                                key={index}
                                className="document-source"
                            >
                                <span className="source-number">
                                {index + 1}
                                </span>

                                <div className="source-content">
                                <p>{source.text}</p>

                                <span className="source-score">
                                    Relevance: {(source.score * 100).toFixed(0)}%
                                </span>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    )}
            </>
            )}

        </section>

        </div>
    </div>
    );

  async function deleteDocument(documentId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this document?"
  );

  if (!confirmed) {
    return;
  }

  setError("");

  try {
    await api.delete(
      `/api/documents/${documentId}`
    );

    // Clear selected document if it was deleted
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
      setSummary("");
      setAnswer("");
      setQuestion("");
    }

    await loadDocuments();
  } catch (error) {
    setError(
      error.response?.data?.detail ||
        "Unable to delete document."
    );
  }
}


  async function summarizeDocument() {
  if (!selectedDocument) {
      return;
  }  
  setSummarizing(true);
  setSummary("");
  setError("");  
  try {
      const response = await api.post(
      `/api/documents/${selectedDocument.id}/summarize`
      );  
      setSummary(response.data.summary);
  } catch (error) {
      setError(
      error.response?.data?.detail ||
          "Unable to summarize document."
      );
  } finally {
      setSummarizing(false);
  }
  }
}

export default Documents;