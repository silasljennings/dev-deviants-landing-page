from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
from firebase_admin import credentials, firestore, initialize_app
import uuid

import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-secret-key')

initialize_app()
db = firestore.client()
collection_path = 'subscribers'

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def create():
    try:
        email = request.form.get('email', '').strip().lower()

        # Validate email
        if not email:
            return {"message": "Please enter a valid email address", "category": "error"}, 400  # Send error message as JSON

        query = db.collection(collection_path).where('email', '==', email).limit(1)
        docs = query.stream()
        if any(d.exists for d in docs):
            return {"message": "That email is already a subscriber", "category": "info"}, 400  # Send error message as JSON
        else:
            uid = str(uuid.uuid4())  # Generates a unique string UID
            new_doc_ref = db.collection(collection_path).document(uid)
            # Add new subscriber
            # todo: break out into model class
            new_doc_ref.set({
                'uid': uid,
                'email': email,
                'subscribed_at': firestore.SERVER_TIMESTAMP,
                'unsubscribed_at': None,
                'is_email_verified': False,
                'first_name': '',
                'first_name_search': '',
                'last_name': '',
                'last_name_search': '',
                'phone_number': '',
                'address': '',
                'address_search': '',
                'scid': '',
                'fcm_token': '',
                'gender': '',
                'dob': None
            })
            return {"message": "Thank you for subscribing! Please verify your email!", "category": "success"}, 200  # Send success message as JSON

    except Exception as e:
        return {"message": f"An Error Occurred: {str(e)}", "category": "error"}, 500  # Send error message if an exception occurs

@app.route('/verify-email', methods=['GET'])
def verify_email():
    token = request.args.get('token')
    print(token)
    if not token:
        return render_template('message.html', title="Invalid Link", message="No verification token provided."), 400

    # 1) Find the email_verifications doc with this token
    verifications_query_snapshot = db.collection('email_verifications').where('token', '==', token).limit(1).get()
    if not verifications_query_snapshot:
        return render_template('message.html', title="Invalid Link", message="Verification link is invalid."), 404

    verification_document = verifications_query_snapshot[0]
    verification = verification_document.to_dict()
    now_ms = int(datetime.utcnow().timestamp() * 1000)

    # 2) Check expiry
    if now_ms > verification.get('expired_stamp', 0):
        return render_template('message.html', title="Link Expired", message="Your verification link has expired. Please request a new one."), 410

    # 3) Mark the verification doc as “used” (update timestamp)
    verification_document.reference.update({ 'updated_stamp': now_ms })

    # 4) Find & update the subscriber
    subscribers_query_snapshot = (db.collection('subscribers').where('email', '==', verification.get('email')).limit(1).get())
    if subscribers_query_snapshot:
        subscribers_query_snapshot[0].reference.update({'is_email_verified': True})

    # 5) Render a success page
    return render_template('message.html', title="Email Verified", message="Thank you! Your email address has been verified.")

# TODO: Unsubscribe route logic

@app.context_processor
def inject_current_year():
    return { 'current_year': datetime.utcnow().year }


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
