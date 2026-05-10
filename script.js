var $get = (id) => {
  return document.getElementById(id);
};
var $tag = (tag) => {
  return document.getElementsByTagName(tag);
};
var $new = (el) => {
  return document.createElement(el);
};
var $class = (cl) => {
  return document.querySelectorAll(cl);
};

const pagecontent = $get("pagecontent");

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

class Window {
  constructor(apply, id, size = [], pos = [], content = []) {
    this.icon = `/icons/` + content[0].replace(/!\w+!/g, "") + `.jpg`;
    this.title = content[0].replace(/!\w+!/g, "");
    this.content = content[1];
    this.width = size[0];
    this.height = size[1];
    this.el = $new("div");
    this.el.id = id;
    this.el.title = this.title.replace(/!\w+!/g, "");
    this.el.classList.add("window");
    this.el.style.width = this.width + "px";
    this.el.style.height = this.height + "px";
    this.el.style.minWidth = "240px";
    this.el.style.minHeight = "180px";
    this.el.style.top = pos[1] + "px";
    this.el.style.left = pos[0] + "px";
    pagecontent.appendChild(this.el);

    this.titleEl = $new("div");
    this.titleEl.classList.add("titleBar");
    this.titleEl.innerHTML = `
          <div class="titleData">${this.title}</div>
          <div class="titleButtons">
            <button onclick="hideWindow('${this.el.id})" class="minimize" tabindex="-1" name="Minimize Window">
              -
            </button>
            <button onclick="closeWindow('${this.el.id}')" class="close" tabindex="-1" name="Close Window">
              &times;
            </button>
          </div>
        `;
    this.el.appendChild(this.titleEl);
    const closeBtn = this.titleEl.querySelector("button.close");
    closeBtn.addEventListener("click", () => this.el.remove());
    this.contentEl = $new("div");
    this.contentEl.classList.add("contentBox");
    this.contentEl.innerHTML =
      `<div class="content">` + this.content + `</div>`;
    this.el.appendChild(this.contentEl);

    //window move
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.titleEl.addEventListener("mousedown", this.startDrag.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDrag.bind(this));
    requestNavbarUpdate(content[0], id, content[1]);
    return this.el;
  }

  startDrag(event) {
    this.dragging = true;
    const rect = this.el.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
    $class(".window").forEach((win) => {
      win.style.zIndex -= 1;
    });

    this.el.style.zIndex = 200;
  }

  drag(event) {
    if (!this.dragging) return;
    this.el.style.left = event.clientX - this.offsetX + "px";
    this.el.style.top = event.clientY - this.offsetY + "px";
  }

  stopDrag(event) {
    this.dragging = false;
  }
}

function closeWindow(windowID) {
  $get(windowID).remove();
  $get("nav-" + windowID).remove();
}

function getIcon(name) {
  const href = name;
  if (href.match(/!fm!/)) {
    return `<svg width="24" height="24" viewBox="0 0 41 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5H38C39.6569 5 41 6.34315 41 8V29C41 30.6569 39.6569 32 38 32H3C1.34315 32 0 30.6569 0 29V5Z" fill="#949fe1"/><path d="M0 3C0 1.34315 1.34315 0 3 0H14C15.6569 0 16.8647 1.36541 17.1952 2.98897C17.424 4.11274 17.9208 5 19 5H0V3Z" fill="#949fe1"/><path d="M10 24C10 22.8954 10.8954 22 12 22H29C30.1046 22 31 22.8954 31 24V32H10V24Z"/><path d="M9 24C9 22.3431 10.3431 21 12 21H29C30.6569 21 32 22.3431 32 24H30C30 23.4477 29.5523 23 29 23H12C11.4477 23 11 23.4477 11 24H9ZM11 24M31 32H10H31M9 32V24C9 22.3431 10.3431 21 12 21V23C11.4477 23 11 23.4477 11 24V32H9ZM29 21C30.6569 21 32 22.3431 32 24V32H30V24C30 23.4477 29.5523 23 29 23V21Z" fill="#000" mask="url(#path-3-inside-1_439_22)"/></svg>`;
  }
  if (href.match(/!web!/)) {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#949fe1"/><circle cx="12" cy="12" r="9" fill="#949fe1" stroke="#000" stroke-width="2"/><path d="M11.9996 3C12.9233 3 13.9927 3.71836 14.8893 5.39941C15.7629 7.03749 16.3336 9.36954 16.3336 12C16.3336 14.6305 15.7629 16.9625 14.8893 18.6006C13.9927 20.2816 12.9233 21 11.9996 21C11.0761 20.9998 10.0074 20.2814 9.11096 18.6006C8.23732 16.9625 7.66663 14.6305 7.66663 12C7.66663 9.36949 8.23732 7.0375 9.11096 5.39941C10.0074 3.71858 11.0761 3.00017 11.9996 3Z" stroke="#000" stroke-width="2"/><path d="M21.3192 12.1999C16 14.5 8 14.5 2.51921 11.9332" stroke="#000" stroke-width="2"/></svg>`;
  }

  if (href.match(/!edit!/)) {
    return `<svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.58333 1L15 7.05H10.5833C9.47876 7.05 8.58333 6.15457 8.58333 5.05V1Z" fill="#949FE1"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1 3C1 1.89543 1.89543 1 3 1H8.58333V5.05C8.58333 6.15457 9.47876 7.05 10.5833 7.05H15V21C15 22.1046 14.1046 23 13 23H3C1.89543 23 1 22.1046 1 21V3Z" fill="#949FE1"/><path d="M15 7.05V21C15 22.1046 14.1046 23 13 23H3C1.89543 23 1 22.1046 1 21V3C1 1.89543 1.89543 1 3 1H8.58333L15 7.05ZM8.58333 1V5.05C8.58333 6.15457 9.47876 7.05 10.5833 7.05H15M3.91667 12H12.0833M12.0833 15.3H3.91667M3.91667 18.6H12.0833" stroke="black" stroke-width="2" stroke-linecap="round"/></svg>`
  }
}

function requestNavbarUpdate(name, winId) {
  const navbar = $get("icons");
  const buttonId = "nav-" + winId;

  if ($get(buttonId)) return;

  const button = $new("button");
  button.id = buttonId;
  button.title = name.replace(/!web!/g, "");
  button.innerHTML = getIcon(name);
  button.dataset.winId = winId;
  button.style.opacity = "100%";
  navbar.appendChild(button);

  button.addEventListener("click", () => {
    const win = $get(winId);

    if (win) {
      win.style.display = win.style.display === "none" ? "block" : "none";
      $get("win-" + winId).style.opacity = win.style.opacity === "100%" ? $get("win-" + winId).style.opacity = "0%": $get("win-" + winId).style.opacity = "100%"
    }
  });
}

function hideWindow(id) {
  let win = $get(id);
  let btn = $get('win-'+id)

  win.style.display = win.style.display === "none" ? "block" : "none";
  btn.style.filter = "opacity(75%)"
}


/////////////////////////

const navmenu = $get("navmenu");
const navcontent = {
  test_0: ["!web!Test Page", "Test page for load, resize, drag, etc."],
  file_editor_1: [
    "!edit!File Editor",
    "<iframe src='/pages/file-editor.html' width='100%' height='97%'>",
  ],
  files_2: ["!fm!File Manager", "<iframe src='file:///media/fuse/drivefs-397479933c14fb393f2c0294c22b9576/root/' style='overflow:hidden' width='100%' height='97%'>"],
  support_3: ["!web!LGBTQ+ Support", "<iframe src='./pages/support.html'>"]
};

Object.entries(navcontent).forEach(([key, val]) => {
  new Window(
    pagecontent,
    "window-" + key,
    [600, 400],
    [40 + 120 * key.replace(/[^0-9]+/g, ""), 60 + 36 * key.replace(/[^0-9]+/g, "")],
    val,
  );
});