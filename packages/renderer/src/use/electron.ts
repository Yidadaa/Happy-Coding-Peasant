type IIpcRenderer = {
  send: (channel: string, data: string) => void;
  receive: (channel: string, func: CallableFunction) => void;
};

export function useElectron(): Readonly<ElectronApi> {
  return window.electron;
}

export function useIpcRenderer(): IIpcRenderer {
  return window.ipcRenderer;
}
