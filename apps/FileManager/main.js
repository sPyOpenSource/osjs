// apps/FileManager/main.js
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
        
        <div id="loading" class="htmx-indicator">Loading...</div>
        <div id="file-list" 
             hx-get="/api/files?path=/"
             hx-trigger="load"
             hx-swap="innerHTML">
        </div>
        
        <div class="statusbar" id="statusbar">Ready</div>
        
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

    window.showNewFolderDialog = () => {
      document.getElementById('new-folder-modal').style.display = 'flex';
      document.getElementById('new-folder-name').focus();
    };

    window.hideNewFolderDialog = () => {
      document.getElementById('new-folder-modal').style.display = 'none';
      document.getElementById('new-folder-name').value = '';
    };

    // Context menu
    window.showContextMenu = (event, filePath, fileName) => {
      event.preventDefault();
      
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
          htmx.trigger('#file-list', 'load');
        }
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    };
    
    if (typeof htmx !== 'undefined') {
      htmx.process($content);
    }

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
  });
  
  return proc;
};

osjs.register('FileManager', register);
