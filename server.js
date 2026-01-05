const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Настройка хранения файлов
const upload = multer({ dest: 'uploads/' });

// Статические файлы (HTML/CSS/JS)
app.use(express.static('public'));

// API: список файлов/папок
app.get('/list', (req, res) => {
  const requestedPath = req.query.path || '';
  const fullPath = path.join(__dirname, 'uploads', requestedPath);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Папка не найдена' });
  }

  const items = fs.readdirSync(fullPath).map(name => {
    const itemPath = path.join(fullPath, name);
    const isDirectory = fs.lstatSync(itemPath).isDirectory();
    return { name, path: path.join(requestedPath, name), isDirectory };
  });

  res.json(items);
});

// API: загрузка файла
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Файл загружен!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
