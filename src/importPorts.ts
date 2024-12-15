import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { parse } from 'csv-parse';

// Import your Port model
import Port from './models/port.model';

const MONGO_URI = 'mongodb://localhost:27017/portfilter';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


const importPorts = async () => {
  const filePath = path.join(__dirname, '../data/ports.csv');

  const ports: { name: string }[] = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const row of parser) {
    if (row.original) {
      ports.push({ name: row.original.trim() });
    }
  }

  console.log(`Finished parsing CSV. Importing ${ports.length} ports...`);

  try {
    await Port.insertMany(ports);
    console.log('Ports imported successfully!');
  } catch (err) {
    console.error('Error importing ports:', err);
  } finally {
    mongoose.disconnect();
  }
};

importPorts();
