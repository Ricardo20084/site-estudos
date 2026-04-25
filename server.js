const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

const DATA_PATH = path.join(__dirname, 'db_projects.json');

// Listar projetos
app.get('/api/projects', (req, res) => {
    if (!fs.existsSync(DATA_PATH)) return res.json([]);
    const data = fs.readFileSync(DATA_PATH);
    res.json(JSON.parse(data));
});

// Salvar projeto
app.post('/api/save', (req, res) => {
    const project = req.body;
    let db = [];
    if (fs.existsSync(DATA_PATH)) {
        db = JSON.parse(fs.readFileSync(DATA_PATH));
    }
    
    const index = db.findIndex(p => p.id === project.id);
    if (index !== -1) {
        db[index] = project;
    } else {
        project.id = Date.now().toString();
        db.push(project);
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
    res.json({ success: true, id: project.id });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});