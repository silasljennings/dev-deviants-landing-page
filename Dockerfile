# Use a Python base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Generate a random SECRET_KEY and set it as an environment variable
RUN echo "SECRET_KEY=$(python -c 'import os; print(os.urandom(24).hex())')" >> .env

# Expose the port Flask runs on
EXPOSE 8080

# Command to run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]
