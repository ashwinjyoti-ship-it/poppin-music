import { app, BrowserWindow } from "electron";

const url = process.env.POPPIN_RENDERER_URL ?? "http://127.0.0.1:5173";

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    backgroundColor: "#F5F2ED",
    title: "Poppin Music",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  void win.loadURL(url);
}

void app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
