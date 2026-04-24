// Vendor type declarations for untyped third-party packages

declare module 'react-simple-maps' {
  export const ComposableMap: any;
    export const Geographies: any;
    export const Geography: any;
    export const Marker: any;
    export const Line: any;
    export const ZoomableGroup: any;
    export const Sphere: any;
    export const Graticule: any;
    const _default: any;
    export default _default;
}

declare module 'zxcvbn' {
    interface ZXCVBNResult {
          score: number;
          feedback: { warning: string; suggestions: string[] };
          crack_times_display: Record<string, string>;
          crack_times_seconds: Record<string, number>;
          guesses: number;
          guesses_log10: number;
    }
    function zxcvbn(password: string, userInputs?: string[]): ZXCVBNResult;
    export = zxcvbn;
}

declare module 'html5-qrcode' {
  export type Html5QrcodeErrorCallback = (errorMessage: string, error: any) => void;
    export type QrcodeSuccessCallback = (decodedText: string, decodedResult: any) => void;
    export class Html5Qrcode {
          constructor(elementId: string, config?: any);
          start(cameraIdOrConfig: any, config: any, qrCodeSuccessCallback: QrcodeSuccessCallback, qrCodeErrorCallback?: Html5QrcodeErrorCallback): Promise<any>;
          stop(): Promise<any>;
          clear(): void;
          getState(): any;
          static getCameras(): Promise<Array<{ id: string; label: string }>>;
          pause(shouldPauseVideo?: boolean): void;
          resume(): void;
    }
    export class Html5QrcodeScanner {
          constructor(elementId: string, config: any, verbose?: boolean);
          render(qrCodeSuccessCallback: QrcodeSuccessCallback, qrCodeErrorCallback?: Html5QrcodeErrorCallback): void;
          clear(): Promise<any>;
          getState(): any;
          pause(shouldPauseVideo?: boolean): void;
          resume(): void;
    }
    export const Html5QrcodeSupportedFormats: any;
}

declare module 'html5-qrcode/esm/html5-qrcode' {
  export type Html5QrcodeErrorCallback = (errorMessage: string, error: any) => void;
    export type QrcodeSuccessCallback = (decodedText: string, decodedResult: any) => void;
    export class Html5Qrcode {
          constructor(elementId: string, config?: any);
          start(cameraIdOrConfig: any, config: any, qrCodeSuccessCallback: QrcodeSuccessCallback, qrCodeErrorCallback?: Html5QrcodeErrorCallback): Promise<any>;
          stop(): Promise<any>;
          clear(): void;
          getState(): any;
          static getCameras(): Promise<Array<{ id: string; label: string }>>;
          pause(shouldPauseVideo?: boolean): void;
          resume(): void;
    }
    export default Html5Qrcode;
}

declare module 'html5-qrcode/esm/html5-qrcode-scanner' {
  export type QrcodeSuccessCallback = (decodedText: string, decodedResult: any) => void;
    export type Html5QrcodeErrorCallback = (errorMessage: string, error: any) => void;
    export class Html5QrcodeScanner {
          constructor(elementId: string, config: any, verbose?: boolean);
          render(qrCodeSuccessCallback: QrcodeSuccessCallback, qrCodeErrorCallback?: Html5QrcodeErrorCallback): void;
          clear(): Promise<any>;
          getState(): any;
    }
    export default Html5QrcodeScanner;
}

declare module 'tesseract.js';
declare module 'speakeasy';
declare module 'otplib';
declare module 'qrcode';
declare module 'archiver';
declare module 'multer';
declare module 'jsdom';
declare module 'sharp';
declare module 'rss-parser';
declare module 'node-fetch';
