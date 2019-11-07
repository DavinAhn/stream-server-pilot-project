import { ComicParser } from '@ridi/comic-parser';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 8080;
const dataPath = path.join(__dirname, '..', 'data');

app.get('/', (req, res) => {
  res.send('test');
});

app.get('/files', (req, res) => {
  const files = fs.readdirSync(dataPath)
    .map((subPath) => {
      const fullPath = path.join(dataPath, subPath);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      return isDirectory ? subPath : null;
    })
    .filter(file => file);
  res.json(files);
});

app.get('/:id/files/metadata', (req, res) => {
  const { id } = req.params;
  if (id) {
    const filePath = path.join(dataPath, id);
    if (fs.existsSync(filePath)) {
      const parser = new ComicParser(filePath);
      parser.parse({ parseImageSize: true }).then((book) => {
        const result = {
          id,
          front_cover_image: {},
          content_images: [],
        };
        book.items.forEach((item, idx) => {
          const { width, height } = item;
          if (idx === 0) {
            result.front_cover_image = { width, height };
          } else {
            result.content_images.push({ width, height });
          }
        });
        res.json(result);
      });
      return;
    }
  }
  res.status(404);
  res.json({ error: `Not found file (id: ${id})` });
});

app.get('/:id/files', (req, res) => {
  const { id } = req.params;
  const offset = parseInt(req.query.page_num, 10);
  if (id && !Number.isNaN(offset)) {
    const filePath = path.join(dataPath, id, `${offset + 1}.jpg`);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404);
      res.json({ error: `Not found file (id: ${id}, offset: ${offset})` });
    }
  } else {
    res.status(400);
    res.json({ error: `Bad request (id: ${id}, offset: ${offset})` });
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
