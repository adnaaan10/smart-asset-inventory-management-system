FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#  ROOT is the working directory
WORKDIR /app

# Copy requirements from root
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy EVERYTHING (apps + manage.py + backend/)
COPY . .

# Run gunicorn using correct module path
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]