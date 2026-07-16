!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(e,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=OSjs},function(e){e.exports=JSON.parse('{"a":"FileManager"}')},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n(1);

function setupFileManager(core, args, options, metadata) {
  var proc = core.make("osjs/application", {args:args, options:options, metadata:metadata});
  
  return proc.createWindow({
    id: "FileManagerWindow",
    title: "File Manager",
    icon: proc.resource(metadata.icon),
    dimension: {width: 800, height: 500}
  })
  .on("destroy", function() { return proc.destroy(); })
  .render(function($content) {
    $content.innerHTML = '<div class="file-manager">' +
      '<div class="toolbar">' +
        '<button hx-get="/api/files?path=.." hx-target="#file-list" hx-swap="innerHTML">\u2191 Up</button>' +
        '<button onclick="window._fmShowNewFolderDialog()">New Folder</button>' +
        '<button onclick="document.getElementById(\'upload-input\').click()">Upload</button>' +
        '<input type="file" id="upload-input" multiple style="display:none" onchange="window._fmUploadFiles(this)" />' +
        '<div class="breadcrumb" id="breadcrumb">' +
          '<span hx-get="/api/files?path=/" hx-target="#file-list" hx-swap="innerHTML">/</span>' +
        '</div>' +
      '</div>' +
      '<div id="loading" class="htmx-indicator">Loading...</div>' +
      '<div id="file-list" hx-get="/api/files?path=/" hx-trigger="load" hx-swap="innerHTML"></div>' +
      '<div class="statusbar" id="statusbar">Ready</div>' +
      '<div id="new-folder-modal" class="modal" style="display:none;">' +
        '<div class="modal-content">' +
          '<h3>New Folder</h3>' +
          '<input type="text" id="new-folder-name" placeholder="Folder name" />' +
          '<div class="modal-buttons">' +
            '<button onclick="window._fmHideNewFolderDialog()">Cancel</button>' +
            '<button onclick="window._fmCreateFolder()">Create</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    window._fmShowNewFolderDialog = function() {
      document.getElementById("new-folder-modal").style.display = "flex";
      document.getElementById("new-folder-name").focus();
    };

    window._fmHideNewFolderDialog = function() {
      document.getElementById("new-folder-modal").style.display = "none";
      document.getElementById("new-folder-name").value = "";
    };

    window._fmShowContextMenu = function(event, filePath, fileName) {
      event.preventDefault();
      var existing = document.getElementById("context-menu");
      if (existing) existing.remove();
      var menu = document.createElement("div");
      menu.id = "context-menu";
      menu.className = "context-menu";
      menu.innerHTML = '<div class="context-menu-item" onclick="window._fmRenameItem(\'' + filePath + '\',\'' + fileName + '\')">Rename</div>' +
        '<div class="context-menu-item" onclick="window._fmDeleteItem(\'' + filePath + '\',\'' + fileName + '\')">Delete</div>';
      menu.style.left = event.pageX + "px";
      menu.style.top = event.pageY + "px";
      document.body.appendChild(menu);
      setTimeout(function() {
        document.addEventListener("click", function() { menu.remove(); }, {once: true});
      }, 0);
    };

    window._fmRenameItem = function(filePath, currentName) {
      var newName = prompt("Rename to:", currentName);
      if (newName && newName !== currentName) {
        fetch("/api/rename", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({oldPath: filePath, newName: newName})
        }).then(function() { htmx.trigger("#file-list", "load"); });
      }
    };

    window._fmDeleteItem = function(filePath, fileName) {
      if (confirm("Delete \"" + fileName + "\"?")) {
        fetch("/api/delete", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({filePath: filePath})
        }).then(function() { htmx.trigger("#file-list", "load"); });
      }
    };

    window._fmUploadFiles = function(input) {
      var files = input.files;
      if (!files.length) return;
      var fileList = document.getElementById("file-list");
      var currentPath = (fileList && fileList.dataset) ? fileList.dataset.currentPath : "/";
      var formData = new FormData();
      formData.append("path", currentPath);
      for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      fetch("/api/upload", {method: "POST", body: formData}).then(function() {
        input.value = "";
        htmx.trigger("#file-list", "load");
      });
    };

    window._fmCreateFolder = function() {
      var name = document.getElementById("new-folder-name").value.trim();
      if (!name) return;
      var fileList = document.getElementById("file-list");
      var currentPath = (fileList && fileList.dataset) ? fileList.dataset.currentPath : "/";
      fetch("/api/mkdir", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({path: currentPath, name: name})
      }).then(function(response) {
        if (response.ok) {
          window._fmHideNewFolderDialog();
          htmx.trigger("#file-list", "load");
        }
      });
    };

    if (typeof htmx !== "undefined") {
      htmx.process($content);
    }

    document.body.addEventListener("refreshFileList", function() {
      htmx.trigger("#file-list", "load");
    });

    $content.addEventListener("htmx:afterRequest", function() {
      var fileList = document.getElementById("file-list");
      if (fileList && fileList.dataset && fileList.dataset.currentPath) {
        updateBreadcrumb(fileList.dataset.currentPath);
      }
    });

    function updateBreadcrumb(path) {
      var breadcrumb = document.getElementById("breadcrumb");
      if (!breadcrumb) return;
      var parts = path.split("/").filter(Boolean);
      var html = '<span hx-get="/api/files?path=/" hx-target="#file-list" hx-swap="innerHTML">/</span>';
      var currentPath = "";
      parts.forEach(function(part) {
        currentPath += "/" + part;
        html += ' / <span hx-get="/api/files?path=' + encodeURIComponent(currentPath) + '" hx-target="#file-list" hx-swap="innerHTML">' + part + '</span>';
      });
      breadcrumb.innerHTML = html;
      htmx.process(breadcrumb);
    }
  }), proc;
}

r.register(o.a, function(core, args, options, metadata) {
  return setupFileManager(core, args, options, metadata);
});

}]);