interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>;

  readonly ipcRenderer: Readonly<Electron.IpcRenderer>;
}

declare interface Window {
  electron: Readonly<ElectronApi>;
  electronRequire?: NodeRequire;
}
