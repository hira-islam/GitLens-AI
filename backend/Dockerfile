# Use a lightweight official Python image
FROM python:3.13-slim

# Don't create unnecessary .pyc files (__pycache__)
ENV PYTHONDONTWRITEBYTECODE=1

# Show logs immediately in docker logs (no buffering)
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements first
# This helps Docker cache dependencies and speeds up future builds
COPY requirements.txt .

# Install Python dependencies
# --no-cache-dir keeps the image smaller
RUN pip install --no-cache-dir -r requirements.txt

# Copy the remaining application source code
COPY . /app

# Inform Docker that the application listens on port 8000
EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]