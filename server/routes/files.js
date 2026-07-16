const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = process.env.FS_ROOT || process.cwd();

async function getFileIcon(ext) {
  const icons = {
    directory: 'icon-folder',
    js: 'icon-js',
    json: 'icon-json',
    html: 'icon-html',
    css: 'icon-css',
    md: 'icon-md',
    txt: 'icon-txt',
    png: 'icon-image',
    jpg: 'icon-image',
    default: 'icon-file'
  };
  return icons[ext] || icons.default;
}

function formatSize(bytes) {
  if (bytes === undefined || bytes === null) return '--';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

router.get('/files', async (req, res) => {
  try {
    const requestedPath = req.query.path || '/';
    const fullPath = path.join(ROOT_DIR, requestedPath);
    
    if (!fullPath.startsWith(ROOT_DIR)) {
      return res.status(403).send('<div>Access denied</div>');
    }
    
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    const files = await Promise.all(
      entries
        .filter(e => !e.name.startsWith('.'))
        .map(async (entry) => {
          const entryPath = path.join(requestedPath, entry.name);
          const stats = await fs.stat(path.join(fullPath, entry.name));
          const ext = entry.isDirectory() ? 'directory' : path.extname(entry.name).slice(1);
          
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: entryPath,
            size: entry.isDirectory() ? '--' : formatSize(stats.size),
            date: formatDate(stats.mtime),
            iconClass: await getFileIcon(ext),
            isDirectory: entry.isDirectory()
          };
        })
    );
    
    files.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    
    let html = `<div id="file-list" data-current-path="${requestedPath}">`;
    files.forEach(file => {
      const clickAttr = file.isDirectory 
        ? `hx-get="/api/files?path=${encodeURIComponent(file.path)}" hx-target="#file-list" hx-swap="innerHTML"`
        : '';
      html += `
        <div class="file-item ${file.type}" 
             data-type="${file.type}" 
             data-path="${file.path}"
             ${clickAttr}>
          <i class="file-icon ${file.iconClass}"></i>
          <span class="file-name">${file.name}</span>
          <span class="file-size">${file.size}</span>
          <span class="file-date">${file.date}</span>
        </div>`;
    });
    html += '</div>';
    
    const dirCount = files.filter(f => f.type === 'directory').length;
    const fileCount = files.filter(f => f.type === 'file').length;

    html += `
<div id="statusbar" hx-swap-oob="true">
  ${dirCount} directories, ${fileCount} files
</div>`;

    res.send(html);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});

router.post('/mkdir', async (req, res) => {
  try {
    const { path: dirPath, name } = req.body;
    
    if (!name || name.includes('/') || name.includes('..')) {
      return res.status(400).send('<div class="error">Invalid name</div>');
    }
    
    const fullPath = path.join(ROOT_DIR, dirPath, name);
    
    if (!fullPath.startsWith(ROOT_DIR)) {
      return res.status(403).send('<div>Access denied</div>');
    }
    
    await fs.mkdir(fullPath, { recursive: true });
    
    const updatedPath = dirPath || '/';
    const listingUrl = `/api/files?path=${encodeURIComponent(updatedPath)}`;
    
    res.setHeader('HX-Redirect', listingUrl);
    res.send('');
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});

module.exports = router;
