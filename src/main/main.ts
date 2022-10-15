/* eslint global-require: off, no-console: off, promise/always-return: off */
import { app, BrowserWindow, shell, ipcMain } from "electron";
import path from "path";
import ElStore from 'electron-store';
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";
import { 
  setUserAuth,
  tryAuth,
  removeUserData,
  setSavedContent,
  isAuthExists,
} from "./ipc/store";
import {
  testHub,
  getChannelMessages,
  sendMessage,
  testTor
} from './ipc/requests';

let mainWindow: BrowserWindow | null = null;

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) require("electron-debug")();

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    const store = new ElStore();
    
    ipcMain.handle('store:setUserAuth', setUserAuth(store));
    ipcMain.handle('store:tryAuth', tryAuth(store));
    ipcMain.handle('store:removeUserData', removeUserData(store));
    ipcMain.handle('store:setSavedContent', setSavedContent(store));
    ipcMain.handle('store:isAuthExists', isAuthExists(store));
    ipcMain.handle('requests:testHub', testHub);
    ipcMain.handle('requests:getChannelMessages', getChannelMessages);
    ipcMain.handle('requests:sendMessage', sendMessage);
    ipcMain.handle('requests:testTor', testTor);
  
    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
