declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export {};
