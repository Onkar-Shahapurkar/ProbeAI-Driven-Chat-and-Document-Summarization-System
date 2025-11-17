from flask import Flask, render_template, redirect
import subprocess

app = Flask(__name__)

@app.route('/run_streamlit')
def run_streamlit():
    subprocess.Popen(['streamlit', 'run', 'file_summarization.py'])
    return redirect("http://localhost:8501")

@app.route('/')
def home():
    return render_template('chat.html')

if __name__ == "__main__":
    app.run(debug=True)
