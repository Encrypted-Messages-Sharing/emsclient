declare global {
  interface Window {
    store: {
      setUserAuth: (pass: string) => void;
      tryAuth: (pass: string) => null | Record<string, any>;
      removeUserData: () => void;
      setSavedContent: (contentType: string, content: any, pass: string) => void;
      isAuthExists: () => boolean;
    },
    requests: {
      testHub: (hub: string, useTor: boolean) => Promise<boolean>;
      getChannelMessages: (
        hub: string, 
        channel: string, 
        limit: number, 
        offset: number, 
        useTor: boolean
      ) => Promise<{
        fullCount: number,
        messages: any[],
      } | 'error'>;
      sendMessage: (
        hub: string, 
        channel: string, 
        text: string,
        comment: string, 
        liveTime: number, 
        useTor: boolean
      ) => Promise<boolean>;
      testTor: () => Promise<boolean>;
    }
  }
}

export {}