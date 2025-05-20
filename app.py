from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
from firebase_admin import credentials, firestore, initialize_app


import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'change-this')

cred = credentials.Certificate("./service-account-key.json")
initialize_app(cred)
db = firestore.client()

SUBSCRIBERS = 'subscribers' # collection name

@app.route('/', methods=['POST'])
def create():
    try:
        email = request.form.get('email', '').strip().lower()

        # Validate email
        if not email:
            return {"message": "Please enter a valid email address", "category": "error"}, 400  # Send error message as JSON

        # Check if email is already in the database
        doc_ref = db.collection(SUBSCRIBERS).document(email)
        if doc_ref.get().exists:
            return {"message": "That email is already a subscriber", "category": "info"}, 400  # Send error message as JSON
        else:
            # Add new subscriber
            doc_ref.set({
                'email': email,
                'subscribed_at': firestore.SERVER_TIMESTAMP,
                'isVerified': False
            })
            return {"message": "Thank you for subscribing! Please verify your email!", "category": "success"}, 200  # Send success message as JSON

    except Exception as e:
        return {"message": f"An Error Occurred: {str(e)}", "category": "error"}, 500  # Send error message if an exception occurs



@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.context_processor
def inject_current_year():
    return { 'current_year': datetime.utcnow().year }


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
