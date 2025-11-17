import streamlit as st
import PyPDF2
import openai
import os
import google.generativeai as genai

# Streamlit app layout
st.set_page_config(page_title="PDF Summarizer", page_icon="📄", layout="wide")

def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

local_css("style.css")

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    return text

# def summarize_text(text):
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",  # Or "gpt-4" if available
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant that summarizes PDF content."},
#             {"role": "user", "content": f"Summarize the following content:\n\n{text}"}
#         ],
#         max_tokens=200,  # Adjust based on how long you want the summary to be
#         temperature=0.5,
#     )
#     return response['choices'][0]['message']['content'].strip()

import requests

prompt="""You are File summarizer. You will be taking the text
and summarizing the entire text and providing the important summary in points
within 250 words. Please provide the summary of the text given here:  """

def summarize_text(text):
    model=genai.GenerativeModel("gemini-pro")
    response=model.generate_content(prompt+text)
    return response.text


st.markdown("<h1 style='text-align: center; color: #FF4B4B;'>PDF Summarizer App</h1>", unsafe_allow_html=True)
st.write("Upload a PDF file and get a summary of its content using AI!")

st.sidebar.title("Settings")
st.sidebar.info("Customize your summarization preferences.")

pdf_file = st.file_uploader("📄 Upload a PDF file", type="pdf")

if pdf_file is not None:
    with st.spinner('📚 Extracting text from PDF...'):
        extracted_text = extract_text_from_pdf(pdf_file)

    with st.expander("📜 View Extracted Text"):
        st.text_area("Extracted Text", extracted_text, height=300)

    summary_length = st.sidebar.slider("Summary Length (in words)", 50, 500, 200)

    model_version = st.sidebar.radio("Choose GPT Model", ["gpt-3.5-turbo", "gpt-4"])

    if st.button("🔍 Summarize"):
        st.subheader("AI Summary")
        with st.spinner('💡 Summarizing...'):
            try:
                summary = summarize_text(extracted_text)
                st.success("✅ Summary completed!")
                st.write(summary)
            except Exception as e:
                st.error(f"❌ An error occurred: {str(e)}")

    progress_bar = st.progress(0)
    for i in range(100):
        progress_bar.progress(i + 1)

    st.markdown("---")

st.markdown("""
    <div style="text-align: center;">
        Made with ❤️ using Streamlit and OpenAI
    </div>
""", unsafe_allow_html=True)