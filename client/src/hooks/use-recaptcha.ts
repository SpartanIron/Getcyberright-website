"use client";

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useCallback } from 'react';

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = useCallback(async (action: string): Promise<string> => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not ready yet');
      return '';
    }

    try {
      const token = await executeRecaptcha(action);
      return token || '';
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return '';
    }
  }, [executeRecaptcha]);

  const isReady = !!executeRecaptcha;

  return { getRecaptchaToken, isReady };
}
