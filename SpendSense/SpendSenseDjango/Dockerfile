# Use an official Python image as the base
FROM python:3.13

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose the port Django runs on
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
