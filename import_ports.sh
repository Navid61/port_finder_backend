#!/bin/bash

# Set environment variables
MONGO_HOST="mongo"
MONGO_PORT="27017"
DATABASE_NAME="ports"
COLLECTION_NAME="ports"
CSV_FILE_PATH="/data/ports.csv"

# Wait for MongoDB to be ready using a more robust approach
echo "Waiting for MongoDB to be ready..."
MAX_WAIT_SECONDS=60
start_time=$(date +%s)

while true; do
  nc -zv $MONGO_HOST $MONGO_PORT > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "MongoDB is ready!"
    break
  fi

  current_time=$(date +%s)
  elapsed_time=$((current_time - start_time))

  if [ $elapsed_time -ge $MAX_WAIT_SECONDS ]; then
    echo "MongoDB did not become ready in time. Exiting."
    exit 1
  fi

  echo "MongoDB is unavailable - sleeping..."
  sleep 2 # Reduced sleep time for faster feedback
done


# Check if the CSV file exists
if [ ! -f "$CSV_FILE_PATH" ]; then
  echo "Error: CSV file not found at $CSV_FILE_PATH. Exiting."
  exit 1
fi

# Import CSV file into MongoDB. Add --jsonFormat 'legacy' for better CSV handling.
echo "Importing data from $CSV_FILE_PATH into $DATABASE_NAME.$COLLECTION_NAME..."
mongoimport --host $MONGO_HOST --port $MONGO_PORT --db $DATABASE_NAME --collection $COLLECTION_NAME --type csv --headerline --file $CSV_FILE_PATH --jsonFormat 'legacy'

if [ $? -eq 0 ]; then
  echo "Data imported successfully!"
else
  echo "Failed to import data. Check the logs for more details."
  exit 1
fi