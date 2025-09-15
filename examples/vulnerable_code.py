# Sample vulnerable Python code for testing LLM-Guard

import sqlite3
import os
from flask import Flask, request

app = Flask(__name__)

# Hardcoded database credentials - SECURITY ISSUE
DB_PASSWORD = "admin123"
SECRET_KEY = "my-secret-key-123"

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    # SQL Injection vulnerability
    conn = sqlite3.connect('users.db')
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    cursor = conn.execute(query)
    user = cursor.fetchone()
    
    if user:
        return f"Welcome {user[1]}!"  # Information disclosure
    else:
        return "Invalid credentials"

@app.route('/file')
def read_file():
    # Path traversal vulnerability
    filename = request.args.get('filename')
    with open(f'/app/files/{filename}', 'r') as f:
        return f.read()

@app.route('/admin')
def admin_panel():
    # Missing authentication
    return "Admin panel - sensitive data here"

# Insecure deserialization
import pickle
@app.route('/process', methods=['POST'])
def process_data():
    data = request.data
    obj = pickle.loads(data)  # Dangerous!
    return str(obj)

if __name__ == '__main__':
    # Debug mode in production - SECURITY ISSUE
    app.run(debug=True, host='0.0.0.0')