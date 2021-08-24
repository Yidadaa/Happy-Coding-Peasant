export function useElectron(): Readonly<ElectronApi> {
  return window.electron;
}

export function useIpcRenderer() {
  return window.electron.ipcRenderer;
}
