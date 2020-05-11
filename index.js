const { app: ElectronApp, BrowserWindow } = require("electron");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";

let mainWindow;
let launchedServer = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

const isPrimaryInstance = ElectronApp.requestSingleInstanceLock();
if (isPrimaryInstance) {
  const app = next({ dev });
  const handle = app.getRequestHandler();
  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
      if (err) throw err;
      launchedServer = true;
      ElectronApp.whenReady().then(createWindow);
    });
  });

  ElectronApp.on("second-instance", (event, argv) => {
    if (process.platform == "win32") {
      deepUrl = argv.slice(1);
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    } else {
      createWindow();
    }
  });

  if (!ElectronApp.isDefaultProtocolClient("spotify-desktop")) {
    ElectronApp.setAsDefaultProtocolClient("spotify-desktop");
  }

  ElectronApp.on("ready", () => launchedServer && createWindow());
  ElectronApp.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
      ElectronApp.quit();
    }
  });
  ElectronApp.on("activate", function () {
    if (mainWindow === null) {
      createWindow();
    }
  });
  ElectronApp.on("will-finish-launching", function () {
    ElectronApp.on("open-url", function (event, url) {
      event.preventDefault();
      const deepUrl = new URL(url);
      const code = deepUrl.searchParams.get("code");
      if (!mainWindow) {
        createWindow();
      }
      mainWindow.loadURL(`http://localhost:3000/?code=${code}`);
    });
  });
} else {
  ElectronApp.quit();
  return;
}
