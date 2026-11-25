"use client";
import { useSyncExternalStore } from 'react';
const subscribe = notify => { document.addEventListener('visibilitychange',notify); return () => document.removeEventListener('visibilitychange',notify); };
const snapshot = () => !document.hidden;
const serverSnapshot = () => true;
export default function usePageVisible(){return useSyncExternalStore(subscribe,snapshot,serverSnapshot);}
