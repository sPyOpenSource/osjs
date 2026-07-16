# htmx File Manager Integration

**Date:** 2026-07-16
**Status:** Draft
**Goal:** Introduce htmx to jsOS by replacing the File Manager's core UI with htmx-powered HTML fragments served from a Node.js backend.

## Context

jsOS is a web-based desktop platform built with JavaScript (based on OS.js). It currently uses webpack-bundled apps with a custom virtual DOM framework. The goal is to gradually introduce htmx to replace the core UI, starting with the File Manager as a proof of concept.

**Why htmx?**
- Simplifies dynamic UI by returning HTML fragments from the server
- Reduces client-side JavaScript complexity
- Enables server-driven architecture that's easier to reason about
- Progressive enhancement - can coexist with existing OS.js code

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     OS.js Window Manager                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              htmx-powered File Manager                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Sidebar    │  │  File List  │  │   Status    │   │  │
│  │  │  (hx-get)   │  │  (hx-get)   │  │   Bar       │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Node.js Server │
                    │  (Express)      │
                    │  - /api/files   │
                    │  - /api/mkdir   │
                    │  - /api/rename  │
                    │  - /api/delete  │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   File System   │
                    └─────────────────┘
```

## Server Design (Node.js + Express)

### Endpoints

| Method | Path | Description | Returns |
|--------|------|-------------|---------|
| GET | `/api/files` | List directory contents | HTML fragment |
| POST | `/api/mkdir` | Create directory | Updated file list HTML |
| POST | `/api/rename` | Rename file/directory | Updated file list HTML |
| POST | `/api/delete` | Delete file/directory | Updated file list HTML |
| POST | `/api/upload` | Upload files | Updated file list HTML |

### Request/Response Examples

**GET /api/files?path=/home/user**
```html
<div id="file-list" hx-swap="innerHTML">
  <div class="file-item" data-type="directory" data-path="/home/user/Documents">
    <i class="icon-folder"></i>
    <span class="name">Documents</span>
    <span class="size">--</span>
    <span class="date">2026-07-15</span>
  </div>
  <div class="file-item" data-type="file" data-path="/home/user/readme.txt">
    <i class="icon-file"></i>
    <span class="name">readme.txt</span>
    <span class="size">1.2 KB</span>
    <span class="date">2026-07-16</span>
  </div>
</div>
```

**POST /api/mkdir**
```json
// Request
{
  "path": "/home/user",
  "name": "new-folder"
}

// Response: Updated HTML fragment (same as GET /api/files?path=/home/user)
```

### Server Structure

```
server/
├── package.json
├── server.js              # Express app entry point
├── routes/
│   └── files.js           # File operation handlers
├── middleware/
│   └── errorHandler.js    # Error handling
└── views/
    ├── layouts/
    │   └── base.html      # Full page layout (for standalone)
    └── partials/
        ├── filelist.html  # File listing fragment
        ├── toolbar.html   # Navigation toolbar
        └── statusbar.html # Status information
```

## Client Design (htmx + OS.js)

### Integration Point

The File Manager app loads htmx and renders an htmx-powered container within an OS.js window:

```javascript
// apps/FileManager/main.js (simplified)
const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', { args, options, metadata });
  
  proc.createWindow({
    id: 'FileManagerWindow',
    title: 'File Manager',
    dimension: { width: 800, height: 500 }
  })
  .on('destroy', () => proc.destroy())
  .render(($content) => {
    // Inject htmx-powered File Manager
    $content.innerHTML = `
      <div class="file-manager"
           hx-get="/api/files?path=/"
           hx-trigger="load"
           hx-target="#file-list"
           hx-indicator="#loading">
        
        <div class="toolbar">
          <button hx-get="/api/files?path=.." hx-target="#file-list">↑</button>
          <div class="breadcrumb" id="breadcrumb"></div>
        </div>
        
        <div id="loading" class="htmx-indicator">Loading...</div>
        <div id="file-list"></div>
        
        <div class="statusbar" id="statusbar"></div>
      </div>
    `;
    
    // Initialize htmx for this container
    htmx.process($content);
  });
  
  return proc;
};
```

### htmx Attributes Used

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `hx-get` | Load file listing | `hx-get="/api/files?path=/"` |
| `hx-post` | Create/rename/delete | `hx-post="/api/mkdir"` |
| `hx-target` | Where to put response | `hx-target="#file-list"` |
| `hx-swap` | How to swap content | `hx-swap="innerHTML"` |
| `hx-trigger` | When to trigger | `hx-trigger="load, click"` |
| `hx-vals` | Send extra data | `hx-vals='{"path": "/"}'` |
| `hx-indicator` | Loading indicator | `hx-indicator="#loading"` |
| `hx-confirm` | Confirmation dialog | `hx-confirm="Delete this file?"` |

### File Manager Features (Phase 1)

1. **File Listing**
   - Grid view with file/folder icons
   - List view with columns (name, size, date)
   - Sort by name, size, date

2. **Navigation**
   - Click folder to enter
   - Breadcrumb bar for path navigation
   - Back button (browser history)

3. **Context Menu**
   - Right-click for operations
   - Options: Open, Rename, Delete, New Folder, Properties

4. **File Operations**
   - Create folder (modal dialog)
   - Rename (inline edit or modal)
   - Delete (confirmation dialog)
   - Upload (file input)

5. **Status Bar**
   - Item count
   - Total size
   - Current path

## File Structure

```
jsOS/
├── server/                          # NEW: Node.js server
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── files.js
│   └── views/
│       └── partials/
│           └── filelist.html
│
├── apps/
│   └── FileManager/
│       ├── main.js                  # MODIFIED: htmx integration
│       ├── main.css                 # MODIFIED: htmx styles
│       └── htmx.css                 # NEW: File Manager htmx styles
│
├── public/                          # NEW: Static assets
│   └── htmx.min.js                  # htmx library (v2.0)
│
├── index.html                       # MODIFIED: Add htmx script tag
└── ...existing files...
```

## Migration Strategy

### Phase 1: File Manager (This PR)
- Add Node.js server with file API endpoints
- Integrate htmx into File Manager
- Keep OS.js window manager
- Test with existing apps

### Phase 2: Other Apps
- Convert Textpad, Calculator to htmx
- Share server infrastructure
- Common UI patterns

### Phase 3: Core Panels
- Replace taskbar with htmx
- System menus with htmx
- Notification system

### Phase 4: Window Manager
- Window controls with htmx
- Desktop icons
- Full htmx-driven UI

## Testing

### Manual Testing
1. Start server: `node server/server.js`
2. Open jsOS in browser
3. Launch File Manager
4. Test: Navigate folders, create/delete/rename files
5. Verify: No JavaScript errors, smooth transitions

### Automated Testing (Future)
- Server endpoint tests (Jest/Supertest)
- htmx integration tests (Cypress/Playwright)

## Open Questions

1. **Authentication:** Should the server require auth? (For now: no, local dev only)
2. **File system scope:**限制访问范围？ (For now: full access for dev)
3. **Real-time updates:** Use SSE for live file changes? (Phase 2)

## Success Criteria

- [ ] File Manager loads and displays file listing
- [ ] Navigation works (click folders, breadcrumbs)
- [ ] Create folder works via htmx
- [ ] Rename works via htmx
- [ ] Delete works with confirmation
- [ ] No regressions in other OS.js apps
- [ ] Server starts and responds correctly
