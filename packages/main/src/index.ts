import { app, BrowserWindow, powerMonitor } from "electron";
import { join } from "path";
import { URL } from "url";
import { menubar, Menubar } from "menubar";

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

let mb: Menubar | null = null;

const createWindow = async () => {
  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.MODE === "development" &&
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname
        ).toString();

  mb = menubar({
    index: pageUrl,
    showDockIcon: true,
    browserWindow: {
      show: false, // Use 'ready-to-show' event to show window
      height: 201,
      vibrancy: "light",
      transparent: true,
      webPreferences: {
        preload: join(__dirname, "../../preload/dist/index.cjs"),
        contextIsolation: import.meta.env.MODE !== "test", // Spectron tests can't work with contextIsolation: true
        enableRemoteModule: import.meta.env.MODE === "test", // Spectron tests can't work with enableRemoteModule: false
      },
    },
  });

  console.log("creating menu bar");

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mb.on("ready", () => {
    mb?.showWindow();

    console.log("menu bar is ready");

    if (import.meta.env.MODE === "development") {
      mb?.window?.webContents.openDevTools();
    }
  });
};

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mb?.window) {
    if (mb.window.isMinimized()) mb.window.restore();
    mb.window.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error("Failed create window:", e));

// Auto-updates
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

powerMonitor.on("unlock-screen", () => {
  console.log("unlock screen");
});

powerMonitor.on("lock-screen", () => {
  console.log("lock screen");
});
