
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 创建 uploads 文件夹（如果没有）
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 配置上传功能（没有文件大小限制，也不限类型）
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage }); // 👈 没有限制文件大小

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 上传接口：支持多个文件上传（字段名叫 'files'）
app.post('/upload', upload.array('files', 20), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: '没有接收到文件' });
    }

    const fileInfos = req.files.map(file => ({
        original: file.originalname,
        savedAs: file.filename
    }));

    res.json({
        message: '上传成功！',
        files: fileInfos
    });
});

// 启动服务器
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ 服务器已启动：http://localhost:${PORT}`);
});
