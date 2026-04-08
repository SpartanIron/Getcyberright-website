"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface PassphraseOptions {
  wordCount: number;
  separator: string;
}

interface GeneratedKey {
  value: string;
  type: string;
  bits: number;
}

interface WorkerMessage {
  type: 'password' | 'passphrase' | 'keys';
  result: string | GeneratedKey[];
  wordListLength?: number;
  requestId: string;
}

let requestIdCounter = 0;
function generateRequestId(): string {
  return `req_${++requestIdCounter}_${Date.now()}`;
}

export function useCryptoWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [wordListLength, setWordListLength] = useState(2048);
  const pendingCallbacks = useRef<Map<string, (response: WorkerMessage) => void>>(new Map());

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/crypto-worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      if (event.data.wordListLength) {
        setWordListLength(event.data.wordListLength);
      }
      const { requestId } = event.data;
      if (pendingCallbacks.current.has(requestId)) {
        const callback = pendingCallbacks.current.get(requestId)!;
        pendingCallbacks.current.delete(requestId);
        callback(event.data);
      }
    };

    worker.onerror = (error) => {
      console.error('Crypto worker error:', error);
    };

    workerRef.current = worker;
    setIsReady(true);

    return () => {
      worker.terminate();
      pendingCallbacks.current.clear();
    };
  }, []);

  const generatePassword = useCallback((options: PasswordOptions): Promise<string> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve('');
        return;
      }

      const requestId = generateRequestId();
      pendingCallbacks.current.set(requestId, (response) => {
        resolve(response.result as string);
      });

      workerRef.current.postMessage({
        type: 'password',
        requestId,
        options: {
          length: options.length,
          uppercase: options.uppercase,
          lowercase: options.lowercase,
          numbers: options.numbers,
          symbols: options.symbols,
        },
      });
    });
  }, []);

  const generatePassphrase = useCallback((options: PassphraseOptions): Promise<string> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve('');
        return;
      }

      const requestId = generateRequestId();
      pendingCallbacks.current.set(requestId, (response) => {
        resolve(response.result as string);
      });

      workerRef.current.postMessage({
        type: 'passphrase',
        requestId,
        options: {
          wordCount: options.wordCount,
          separator: options.separator,
        },
      });
    });
  }, []);

  const generateKeys = useCallback((): Promise<GeneratedKey[]> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve([]);
        return;
      }

      const requestId = generateRequestId();
      pendingCallbacks.current.set(requestId, (response) => {
        resolve(response.result as GeneratedKey[]);
      });

      workerRef.current.postMessage({ type: 'keys', requestId });
    });
  }, []);

  return {
    isReady,
    wordListLength,
    generatePassword,
    generatePassphrase,
    generateKeys,
  };
}
