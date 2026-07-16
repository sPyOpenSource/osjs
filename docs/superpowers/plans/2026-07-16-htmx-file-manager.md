# htmx File Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce htmx to jsOS by replacing the File Manager's core UI with htmx-powered HTML fragments served from a Node.js backend.

**Architecture:** Node.js/Express server returns HTML fragments for file operations. htmx client within OS.js window manages dynamic UI updates. OS.js window manager remains unchanged.

**Tech Stack:** Node.js, Express, htmx 2.0, vanilla CSS

## Global Constraints

- OS.js window manager must remain functional
- htmx library loaded from `/public/htmx.min.js`
- Server runs on port 3000 (configurable via PORT env)
- File operations limited to a configurable root directory
- No authentication for initial implementation

---

## File Structure

```
jsOS/
├── server/                          # NEW
│   ├── package.json                 # Node.js dependencies
│   ├── server.js                    # Express entry point
│   ├── routes/
│   │   └── files.js                 # File operation handlers
│   └── views/
│       └── partials/
│           ├── filelist.html        # File listing fragment
│           └── toolbar.html         # Navigation toolbar
│
├── public/                          # NEW
│   └── htmx.min.js                  # htmx library
│
├── apps/
│   └── FileManager/
│       ├── main.js                  # MODIFIED: htmx container
│       └── filemanager.css          # NEW: File Manager styles
│
├── index.html                       # MODIFIED: htmx script
└── ...existing files...
```

---

### Task 1: Initialize Node.js Server

**Files:**
- Create: `server/package.json`
- Create: `server/server.js`

**Interfaces:**
- Consumes: None
- Produces: Express server listening on port 3000

- [ ] **Step 1: Create server directory**

```bash
mkdir -p server/routes server/views/partials
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "jsos-server",
  "version": "1.0.0",
  "description": "jsOS htmx server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

- [ ] **Step 3: Create server.js**

```javascript
const express = require('express');
const path = require('path');
const filesRouter = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api', filesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`jsOS server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 4: Create placeholder routes file**

```javascript
// server/routes/files.js
const express = require('express');
const router = express.Router();

router.get('/files', (req, res) => {
  res.send('<div>File listing placeholder</div>');
});

module.exports = router;
```

- [ ] **Step 5: Install dependencies and test**

```bash
cd server && npm install
```

Run: `node server.js`
Expected: Server starts, visit http://localhost:3000/api/health returns `{"status":"ok"}`

- [ ] **Step 6: Commit**

```bash
git add server/
git commit -m "feat: initialize Node.js server with Express"
```

---

### Task 2: Implement File Listing Endpoint

**Files:**
- Modify: `server/routes/files.js`
- Create: `server/views/partials/filelist.html`

**Interfaces:**
- Consumes: None
- Produces: GET `/api/files?path=/` returns HTML fragment

- [ ] **Step 1: Create filelist.html template**

```html
<!-- server/views/partials/filelist.html -->
<div id="file-list">
  {{#each files}}
  <div class="file-item" 
       data-type="{{this.type}}" 
       data-path="{{this.path}}"
       {{#if isDirectory}}hx-get="/api/files?path={{this.path}}"{{/if}}
       hx-target="#file-list"
       hx-swap="innerHTML">
    <i class="file-icon {{this.iconClass}}"></i>
    <span class="file-name">{{this.name}}</span>
    <span class="file-size">{{this.size}}</span>
    <span class="file-date">{{this.date}}</span>
  </div>
  {{/each}}
</div>
```

- [ ] **Step 2: Implement file listing with real fs operations**

```javascript
// server/routes/files.js
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
    
    // Security: prevent path traversal
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
    
    // Sort: directories first, then by name
    files.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    
    // Render HTML fragment
    let html = '<div id="file-list">';
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
    
    res.send(html);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});

module.exports = router;
```

- [ ] **Step 3: Test file listing**

Run: `node server.js`
Expected: Server starts

Run: `curl "http://localhost:3000/api/files?path=/"`
Expected: HTML with file listing

- [ ] **Step 4: Commit**

```bash
git add server/routes/files.js
git commit -m "feat: implement file listing endpoint with HTML fragments"
```

---

### Task 3: Download and Integrate htmx

**Files:**
- Create: `public/htmx.min.js`

**Interfaces:**
- Consumes: None
- Produces: htmx library available at `/public/htmx.min.js`

- [ ] **Step 1: Download htmx**

```bash
mkdir -p public
curl -L https://unpkg.com/htmx.org@2.0.0/dist/htmx.min.js -o public/htmx.min.js
```

- [ ] **Step 2: Verify download**

```bash
head -c 100 public/htmx.min.js
```

Expected: Starts with htmx version comment

- [ ] **Step 3: Commit**

```bash
git add public/htmx.min.js
git commit -m "feat: add htmx 2.0 library"
```

---

### Task 4: Update index.html with htmx

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: htmx.min.js from Task 3
- Produces: htmx loaded globally

- [ ] **Step 1: Add htmx script tag**

```html
<!-- index.html - add before closing </body> -->
<script type="text/javascript" src="vendors~osjs.js"></script>
<script type="text/javascript" src="osjs.js"></script>
<script type="text/javascript" src="/public/htmx.min.js"></script>
```

- [ ] **Step 2: Verify htmx loads**

Open browser console, type: `htmx`
Expected: htmx object defined

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: integrate htmx into jsOS"
```

---

### Task 5: Create File Manager htmx Container

**Files:**
- Modify: `apps/FileManager/main.js`
- Create: `apps/FileManager/filemanager.css`

**Interfaces:**
- Consumes: htmx from Task 4, file listing endpoint from Task 2
- Produces: File Manager window with htmx-powered UI

- [ ] **Step 1: Create filemanager.css**

```css
/* apps/FileManager/filemanager.css */
.file-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
}

.file-manager .toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  gap: 8px;
}

.file-manager .toolbar button {
  padding: 4px 8px;
  cursor: pointer;
}

.file-manager .breadcrumb {
  display: flex;
  gap: 4px;
  flex: 1;
}

.file-manager .breadcrumb span {
  cursor: pointer;
  color: #0066cc;
}

.file-manager .breadcrumb span:hover {
  text-decoration: underline;
}

.file-manager #file-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.file-manager .file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  gap: 12px;
}

.file-manager .file-item:hover {
  background: #f0f0f0;
}

.file-manager .file-item.selected {
  background: #e0e0ff;
}

.file-manager .file-icon {
  width: 24px;
  height: 24px;
  background: #ccc;
  border-radius: 4px;
}

.file-manager .file-item.directory .file-icon {
  background: #ffd700;
}

.file-manager .file-name {
  flex: 1;
}

.file-manager .file-size,
.file-manager .file-date {
  color: #666;
  font-size: 0.9em;
}

.file-manager .statusbar {
  padding: 8px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  font-size: 0.9em;
  color: #666;
}

.htmx-indicator {
  display: none;
}

.htmx-request .htmx-indicator {
  display: block;
}
```

- [ ] **Step 2: Update main.js with htmx container**

```javascript
// apps/FileManager/main.js - replace content
const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', { args, options, metadata });
  
  proc.createWindow({
    id: 'FileManagerWindow',
    title: 'File Manager',
    icon: metadata.icon,
    dimension: { width: 800, height: 500 }
  })
  .on('destroy', () => proc.destroy())
  .render(($content) => {
    $content.innerHTML = `
      <div class="file-manager">
        <div class="toolbar">
          <button hx-get="/api/files?path=.." 
                  hx-target="#file-list" 
                  hx-swap="innerHTML"
                  hx-include="[data-current-path]">↑ Up</button>
          <div class="breadcrumb" id="breadcrumb">
            <span hx-get="/api/files?path=/" 
                  hx-target="#file-list" 
                  hx-swap="innerHTML">/</span>
          </div>
        </div>
        
        <div id="loading" class="htmx-indicator">Loading...</div>
        <div id="file-list" 
             hx-get="/api/files?path=/"
             hx-trigger="load"
             hx-swap="innerHTML">
        </div>
        
        <div class="statusbar" id="statusbar">
          Ready
        </div>
      </div>
    `;
    
    // Process htmx attributes in the new content
    if (typeof htmx !== 'undefined') {
      htmx.process($content);
    }
  });
  
  return proc;
};

osjs.register('FileManager', register);
```

- [ ] **Step 3: Test File Manager launches**

Start server: `node server.js`
Open jsOS, launch File Manager
Expected: Window opens, file listing appears

- [ ] **Step 4: Commit**

```bash
git add apps/FileManager/
git commit -m "feat: File Manager with htmx-powered file listing"
```

---

### Task 6: Add Folder Navigation with Breadcrumbs

**Files:**
- Modify: `server/routes/files.js`

**Interfaces:**
- Consumes: File listing endpoint from Task 2
- Produces: Updated HTML with breadcrumb data attributes

- [ ] **Step 1: Update server to include breadcrumb data**

```javascript
// server/routes/files.js - update the GET /files handler
// Add after the html variable construction:

// Add breadcrumb data attribute
html = html.replace('<div id="file-list">', 
  `<div id="file-list" data-current-path="${requestedPath}">`);

// Also add status bar update
const dirCount = files.filter(f => f.type === 'directory').length;
const fileCount = files.filter(f => f.type === 'file').length;
const totalSize = files.reduce((acc, f) => {
  if (f.type === 'file') {
    const sizeStr = f.size.replace(/[^0-9.]/g, '');
    return acc + (parseFloat(sizeStr) || 0);
  }
  return acc;
}, 0);

html += `
<div id="statusbar" hx-swap-oob="true">
  ${dirCount} directories, ${fileCount} files
</div>`;
```

- [ ] **Step 2: Update main.js breadcrumb handling**

```javascript
// apps/FileManager/main.js - add after htmx.process($content)
// Listen for htmx:afterRequest to update breadcrumb
$content.addEventListener('htmx:afterRequest', (event) => {
  const fileList = document.getElementById('file-list');
  if (fileList && fileList.dataset.currentPath) {
    updateBreadcrumb(fileList.dataset.currentPath);
  }
});

function updateBreadcrumb(path) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;
  
  const parts = path.split('/').filter(Boolean);
  let html = `<span hx-get="/api/files?path=/" hx-target="#file-list" hx-swap="innerHTML">/</span>`;
  
  let currentPath = '';
  parts.forEach((part, i) => {
    currentPath += '/' + part;
    html += ` / <span hx-get="/api/files?path=${encodeURIComponent(currentPath)}" hx-target="#file-list" hx-swap="innerHTML">${part}</span>`;
  });
  
  breadcrumb.innerHTML = html;
  htmx.process(breadcrumb);
}
```

- [ ] **Step 3: Test navigation**

Click a folder
Expected: File listing updates, breadcrumb shows path

Click breadcrumb item
Expected: Navigate to that directory

- [ ] **Step 4: Commit**

```bash
git add server/routes/files.js apps/FileManager/main.js
git commit -m "feat: add breadcrumb navigation to File Manager"
```

---

### Task 7: Add Create Folder Endpoint

**Files:**
- Modify: `server/routes/files.js`

**Interfaces:**
- Consumes: File listing endpoint from Task 2
- Produces: POST `/api/mkdir` returns updated file list

- [ ] **Step 1: Add mkdir endpoint**

```javascript
// server/routes/files.js - add before module.exports

router.post('/mkdir', async (req, res) => {
  try {
    const { path: dirPath, name } = req.body;
    
    if (!name || name.includes('/') || name.includes('..')) {
      return res.status(400).send('<div class="error">Invalid name</div>');
    }
    
    const fullPath = path.join(ROOT_DIR, dirPath, name);
    
    // Security check
    if (!fullPath.startsWith(ROOT_DIR)) {
      return res.status(403).send('<div>Access denied</div>');
    }
    
    await fs.mkdir(fullPath, { recursive: true });
    
    // Return updated file listing
    const updatedPath = dirPath || '/';
    const listingUrl = `/api/files?path=${encodeURIComponent(updatedPath)}`;
    
    // Redirect to get fresh listing
    res.setHeader('HX-Redirect', listingUrl);
    res.send('');
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});
```

- [ ] **Step 2: Test mkdir endpoint**

```bash
curl -X POST http://localhost:3000/api/mkdir \
  -H "Content-Type: application/json" \
  -d '{"path": "/", "name": "test-folder"}'
```

Expected: 200 response, folder created

- [ ] **Step 3: Commit**

```bash
git add server/routes/files.js
git commit -m "feat: add create folder endpoint"
```

---

### Task 8: Add Create Folder UI

**Files:**
- Modify: `apps/FileManager/main.js`

**Interfaces:**
- Consumes: POST `/api/mkdir` from Task 7
- Produces: Modal dialog for folder creation

- [ ] **Step 1: Add create folder button and modal**

```javascript
// apps/FileManager/main.js - update toolbar in render()

$content.innerHTML = `
  <div class="file-manager">
    <div class="toolbar">
      <button hx-get="/api/files?path=.." 
              hx-target="#file-list" 
              hx-swap="innerHTML">↑ Up</button>
      <button onclick="showNewFolderDialog()">New Folder</button>
      <div class="breadcrumb" id="breadcrumb">
        <span hx-get="/api/files?path=/" 
              hx-target="#file-list" 
              hx-swap="innerHTML">/</span>
      </div>
    </div>
    
    <div id="loading" class="htmx-indicator">Loading...</div>
    <div id="file-list" 
         hx-get="/api/files?path=/"
         hx-trigger="load"
         hx-swap="innerHTML">
    </div>
    
    <div class="statusbar" id="statusbar">Ready</div>
    
    <!-- New Folder Modal -->
    <div id="new-folder-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <h3>New Folder</h3>
        <input type="text" id="new-folder-name" placeholder="Folder name" />
        <div class="modal-buttons">
          <button onclick="hideNewFolderDialog()">Cancel</button>
          <button onclick="createFolder()">Create</button>
        </div>
      </div>
    </div>
  </div>
`;

// Add modal functions to window
window.showNewFolderDialog = () => {
  document.getElementById('new-folder-modal').style.display = 'flex';
  document.getElementById('new-folder-name').focus();
};

window.hideNewFolderDialog = () => {
  document.getElementById('new-folder-modal').style.display = 'none';
  document.getElementById('new-folder-name').value = '';
};

window.createFolder = async () => {
  const name = document.getElementById('new-folder-name').value.trim();
  if (!name) return;
  
  const fileList = document.getElementById('file-list');
  const currentPath = fileList?.dataset?.currentPath || '/';
  
  try {
    const response = await fetch('/api/mkdir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: currentPath, name })
    });
    
    if (response.ok) {
      hideNewFolderDialog();
      // Reload file listing
      htmx.trigger('#file-list', 'load');
    }
  } catch (error) {
    console.error('Error creating folder:', error);
  }
};
```

- [ ] **Step 2: Add modal CSS**

```css
/* apps/FileManager/filemanager.css - add to end */

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-buttons button {
  padding: 8px 16px;
}
```

- [ ] **Step 3: Test create folder**

Click "New Folder" button
Type folder name, click Create
Expected: Folder appears in listing

- [ ] **Step 4: Commit**

```bash
git add apps/FileManager/
git commit -m "feat: add create folder UI with modal dialog"
```

---

### Task 9: Add Rename Endpoint

**Files:**
- Modify: `server/routes/files.js`

**Interfaces:**
- Consumes: File listing endpoint from Task 2
- Produces: POST `/api/rename` returns updated file list

- [ ] **Step 1: Add rename endpoint**

```javascript
// server/routes/files.js - add before module.exports

router.post('/rename', async (req, res) => {
  try {
    const { oldPath, newName } = req.body;
    
    if (!newName || newName.includes('/') || newName.includes('..')) {
      return res.status(400).send('<div class="error">Invalid name</div>');
    }
    
    const oldFullPath = path.join(ROOT_DIR, oldPath);
    const dir = path.dirname(oldFullPath);
    const newFullPath = path.join(dir, newName);
    
    // Security checks
    if (!oldFullPath.startsWith(ROOT_DIR) || !newFullPath.startsWith(ROOT_DIR)) {
      return res.status(403).send('<div>Access denied</div>');
    }
    
    await fs.rename(oldFullPath, newFullPath);
    
    // Return empty response with HX-Trigger to refresh
    res.setHeader('HX-Trigger', 'refreshFileList');
    res.send('');
  } catch (error) {
    console.error('Error renaming:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});
```

- [ ] **Step 2: Test rename endpoint**

```bash
curl -X POST http://localhost:3000/api/rename \
  -H "Content-Type: application/json" \
  -d '{"oldPath": "/test-folder", "newName": "renamed-folder"}'
```

Expected: 200 response, folder renamed

- [ ] **Step 3: Commit**

```bash
git add server/routes/files.js
git commit -m "feat: add rename endpoint"
```

---

### Task 10: Add Rename UI

**Files:**
- Modify: `apps/FileManager/main.js`

**Interfaces:**
- Consumes: POST `/api/rename` from Task 9
- Produces: Right-click rename option

- [ ] **Step 1: Add context menu and rename functionality**

```javascript
// apps/FileManager/main.js - add after other window functions

// Context menu
window.showContextMenu = (event, filePath, fileName) => {
  event.preventDefault();
  
  // Remove existing menu
  const existing = document.getElementById('context-menu');
  if (existing) existing.remove();
  
  const menu = document.createElement('div');
  menu.id = 'context-menu';
  menu.className = 'context-menu';
  menu.innerHTML = `
    <div class="context-menu-item" onclick="renameItem('${filePath}', '${fileName}')">Rename</div>
    <div class="context-menu-item" onclick="deleteItem('${filePath}', '${fileName}')">Delete</div>
  `;
  menu.style.left = event.pageX + 'px';
  menu.style.top = event.pageY + 'px';
  
  document.body.appendChild(menu);
  
  // Close on click outside
  setTimeout(() => {
    document.addEventListener('click', () => menu.remove(), { once: true });
  }, 0);
};

window.renameItem = (filePath, currentName) => {
  const newName = prompt('Rename to:', currentName);
  if (newName && newName !== currentName) {
    fetch('/api/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPath: filePath, newName })
    }).then(() => {
      htmx.trigger('#file-list', 'load');
    });
  }
};
```

- [ ] **Step 2: Add context menu CSS**

```css
/* apps/FileManager/filemanager.css - add to end */

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
  z-index: 1001;
  min-width: 120px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
}

.context-menu-item:hover {
  background: #f0f0f0;
}
```

- [ ] **Step 3: Update file items with context menu**

```javascript
// server/routes/files.js - update the file item rendering in GET /files

// Change the file item div to include oncontextmenu
html += `
  <div class="file-item ${file.type}" 
       data-type="${file.type}" 
       data-path="${file.path}"
       ${clickAttr}
       oncontextmenu="showContextMenu(event, '${file.path}', '${file.name}')">
    <i class="file-icon ${file.iconClass}"></i>
    <span class="file-name">${file.name}</span>
    <span class="file-size">${file.size}</span>
    <span class="file-date">${file.date}</span>
  </div>`;
```

- [ ] **Step 4: Test rename**

Right-click a file/folder
Click "Rename"
Enter new name
Expected: Item renamed in listing

- [ ] **Step 5: Commit**

```bash
git add server/routes/files.js apps/FileManager/main.js
git commit -m "feat: add rename UI with context menu"
```

---

### Task 11: Add Delete Endpoint

**Files:**
- Modify: `server/routes/files.js`

**Interfaces:**
- Consumes: File listing endpoint from Task 2
- Produces: POST `/api/delete` returns updated file list

- [ ] **Step 1: Add delete endpoint**

```javascript
// server/routes/files.js - add before module.exports

router.post('/delete', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    const fullPath = path.join(ROOT_DIR, filePath);
    
    // Security check
    if (!fullPath.startsWith(ROOT_DIR)) {
      return res.status(403).send('<div>Access denied</div>');
    }
    
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }
    
    // Return empty response with HX-Trigger to refresh
    res.setHeader('HX-Trigger', 'refreshFileList');
    res.send('');
  } catch (error) {
    console.error('Error deleting:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});
```

- [ ] **Step 2: Test delete endpoint**

```bash
curl -X POST http://localhost:3000/api/delete \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/renamed-folder"}'
```

Expected: 200 response, folder deleted

- [ ] **Step 3: Commit**

```bash
git add server/routes/files.js
git commit -m "feat: add delete endpoint"
```

---

### Task 12: Add Delete UI with Confirmation

**Files:**
- Modify: `apps/FileManager/main.js`

**Interfaces:**
- Consumes: POST `/api/delete` from Task 11
- Produces: Delete confirmation dialog

- [ ] **Step 1: Add deleteItem function**

```javascript
// apps/FileManager/main.js - add after renameItem function

window.deleteItem = (filePath, fileName) => {
  if (confirm(`Delete "${fileName}"?`)) {
    fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath })
    }).then(() => {
      htmx.trigger('#file-list', 'load');
    });
  }
};
```

- [ ] **Step 2: Test delete**

Right-click a file
Click "Delete"
Confirm deletion
Expected: Item removed from listing

- [ ] **Step 3: Commit**

```bash
git add apps/FileManager/main.js
git commit -m "feat: add delete UI with confirmation dialog"
```

---

### Task 13: Add Upload Endpoint

**Files:**
- Modify: `server/routes/files.js`

**Interfaces:**
- Consumes: File listing endpoint from Task 2
- Produces: POST `/api/upload` handles file uploads

- [ ] **Step 1: Add upload endpoint**

```javascript
// server/routes/files.js - add before module.exports

const multer = require('multer');
const upload = multer({ dest: '/tmp/uploads/' });

router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const targetDir = req.body.path || '/';
    const targetFullPath = path.join(ROOT_DIR, targetDir);
    
    // Security check
    if (!targetFullPath.startsWith(ROOT_DIR)) {
      return res.status(403).send('<div>Access denied</div>');
    }
    
    // Move uploaded files to target directory
    for (const file of req.files) {
      const destPath = path.join(targetFullPath, file.originalname);
      await fs.rename(file.path, destPath);
    }
    
    // Return empty response with HX-Trigger to refresh
    res.setHeader('HX-Trigger', 'refreshFileList');
    res.send('');
  } catch (error) {
    console.error('Error uploading:', error);
    res.status(500).send(`<div class="error">Error: ${error.message}</div>`);
  }
});
```

- [ ] **Step 2: Add multer to package.json**

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "multer": "^1.4.5-lts.1"
  }
}
```

Run: `cd server && npm install`

- [ ] **Step 3: Commit**

```bash
git add server/
git commit -m "feat: add file upload endpoint"
```

---

### Task 14: Add Upload UI

**Files:**
- Modify: `apps/FileManager/main.js`

**Interfaces:**
- Consumes: POST `/api/upload` from Task 13
- Produces: Upload button and file input

- [ ] **Step 1: Add upload button to toolbar**

```javascript
// apps/FileManager/main.js - update toolbar HTML

<div class="toolbar">
  <button hx-get="/api/files?path=.." 
          hx-target="#file-list" 
          hx-swap="innerHTML">↑ Up</button>
  <button onclick="showNewFolderDialog()">New Folder</button>
  <button onclick="document.getElementById('upload-input').click()">Upload</button>
  <input type="file" id="upload-input" multiple style="display:none" onchange="uploadFiles(this)" />
  <div class="breadcrumb" id="breadcrumb">
    <span hx-get="/api/files?path=/" 
          hx-target="#file-list" 
          hx-swap="innerHTML">/</span>
  </div>
</div>
```

- [ ] **Step 2: Add uploadFiles function**

```javascript
// apps/FileManager/main.js - add after other window functions

window.uploadFiles = async (input) => {
  const files = input.files;
  if (!files.length) return;
  
  const fileList = document.getElementById('file-list');
  const currentPath = fileList?.dataset?.currentPath || '/';
  
  const formData = new FormData();
  formData.append('path', currentPath);
  for (const file of files) {
    formData.append('files', file);
  }
  
  try {
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    input.value = '';
    htmx.trigger('#file-list', 'load');
  } catch (error) {
    console.error('Error uploading:', error);
  }
};
```

- [ ] **Step 3: Test upload**

Click "Upload" button
Select file(s)
Expected: Files appear in listing

- [ ] **Step 4: Commit**

```bash
git add apps/FileManager/main.js
git commit -m "feat: add file upload UI"
```

---

### Task 15: Add HX-Trigger Listener for Refresh

**Files:**
- Modify: `apps/FileManager/main.js`

**Interfaces:**
- Consumes: HX-Trigger headers from Tasks 9, 11, 13
- Produces: Automatic refresh on file operations

- [ ] **Step 1: Add HX-Trigger listener**

```javascript
// apps/FileManager/main.js - add in render() after htmx.process()

// Listen for HX-Trigger refresh events
document.body.addEventListener('refreshFileList', () => {
  htmx.trigger('#file-list', 'load');
});
```

- [ ] **Step 2: Test refresh**

Perform rename, delete, or upload
Expected: File listing refreshes automatically

- [ ] **Step 3: Commit**

```bash
git add apps/FileManager/main.js
git commit -m "feat: add HX-Trigger listener for auto-refresh"
```

---

## Verification Checklist

- [ ] Server starts without errors
- [ ] File Manager launches in jsOS
- [ ] File listing displays correctly
- [ ] Folder navigation works (click, breadcrumbs)
- [ ] Create folder works (modal dialog)
- [ ] Rename works (context menu)
- [ ] Delete works (confirmation dialog)
- [ ] Upload works (file input)
- [ ] Auto-refresh works after operations
- [ ] No regressions in other OS.js apps
