const { app, dialog, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

const gdata = [];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const wstate = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  const mainWindow = new BrowserWindow({
    x: wstate.x,
    y: wstate.y,
    width: wstate.width,
    height: wstate.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    }
  });

  wstate.manage(mainWindow);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();

  gdata.push(1);
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine, _workingDirectory) => {
    // URL Redirection 처리
    for (let i = 1; i < commandLine.length; i += 1) {
      const spec = /--url-redir=(.+)/.exec(commandLine[i]);
      if (spec) {
        const win = BrowserWindow.getAllWindows()[0];
        if (win.isMinimized()) myWindow.restore();
        win.focus();
        win.webContents.send('url-redir', spec[1]);
        return;
      }
    }

    // 그렇지 않으면 새로운 window 생성
    createWindow();
  });

  app.on('ready', createWindow);
}
