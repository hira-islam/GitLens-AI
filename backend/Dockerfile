# Use a lightweight official Python image
FROM python:3.13-slim

# Don't create unnecessary .pyc files (__pycache__)
ENV PYTHONDONTWRITEBYTECODE=1

# Show logs immediately in docker logs (no buffering)
ENV PYTHONUNBUFFERED=1

# Create a non-root user and group
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --create-home appuser

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements first
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY . .

# Set ownership of the application files
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Inform Docker that the application listens on port 8000
EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]