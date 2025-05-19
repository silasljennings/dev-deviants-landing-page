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
        if not email:
            flash('Please enter a valid email address.', 'error')
            return redirect(url_for('index'))

        # Check if already subscribed
        doc_ref = db.collection(SUBSCRIBERS).document(email)
        if doc_ref.get().exists:
            flash('That email is already subscribed.', 'info')
        else:
            # write new subscriber
            doc_ref.set({
                'email': email,
                'subscribed_at': firestore.SERVER_TIMESTAMP
            })
            flash('Thank you for subscribing!', 'success')

        return redirect(url_for('index'))
    except Exception as e:
        return f"An Error Occurred: {e}"


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.context_processor
def inject_current_year():
    return { 'current_year': datetime.utcnow().year }


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
