FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app/

# Expose port
EXPOSE 7860

# Set environment variables
ENV PORT=7860
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python3", "app.py"]
