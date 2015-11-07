
declare module FayeWebsocket {
  export function Client(url: string): void;
}

declare module 'faye-websocket' {
  export = FayeWebsocket;
}
