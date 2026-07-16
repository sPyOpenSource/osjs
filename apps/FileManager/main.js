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
    
    if (typeof htmx !== 'undefined') {
      htmx.process($content);
    }
  });
  
  return proc;
};

osjs.register('FileManager', register);
