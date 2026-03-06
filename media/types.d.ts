declare global {
  interface Window {
    i18n: {
      commands: string;
      push: string;
      pull: string;
      open: string;
      reload: string;
      macroRunner: string;
      run: string;
      method: string;
      args: string;
    };
  }
}

export {};
