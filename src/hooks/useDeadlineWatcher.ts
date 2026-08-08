import { useEffect, useRef } from 'react';
import { notifyHackathonStarted, notifyHackathonEndingSoon, notifyHackathonEnded } from '../services/notificationService';

const FIRED_KEY = 'hc_fired_deadline_events';
const PREV_KEY = 'hc_hackathon_status_map';

type Status = 'UPCOMING' | 'LIVE' | 'ENDED';

const loadJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
};

const saveJSON = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const getStatus = (h: { startDate?: string; endDate?: string }): Status => {
  const now = Date.now();
  const start = h.startDate ? new Date(h.startDate).getTime() : NaN;
  const end = h.endDate ? new Date(h.endDate).getTime() : NaN;
  if (!Number.isNaN(start) && !Number.isNaN(end)) {
    if (now < start) return 'UPCOMING';
    if (now > end) return 'ENDED';
    return 'LIVE';
  }
  if (!Number.isNaN(start) && now >= start) return 'LIVE';
  if (!Number.isNaN(end) && now > end) return 'ENDED';
  return 'UPCOMING';
};

export const useDeadlineWatcher = (hackathons: Array<{ id: string; title: string; startDate?: string; endDate?: string; submissionDeadline?: string }>) => {
  const firedRef = useRef<Record<string, boolean>>(loadJSON(FIRED_KEY, {}));
  const prevRef = useRef<Record<string, Status>>(loadJSON(PREV_KEY, {}));

  useEffect(() => {
    const evaluate = () => {
      const now = Date.now();
      let changed = false;

      hackathons.forEach((h) => {
        const id = h.id || h.title;
        const status = getStatus(h);
        const prev = prevRef.current[id];
        const deadlineMs = Math.min(
          h.endDate ? new Date(h.endDate).getTime() : Infinity,
          h.submissionDeadline ? new Date(h.submissionDeadline).getTime() : Infinity
        );

        if (status === 'LIVE' && prev !== 'LIVE') {
          const startedMs = h.startDate ? new Date(h.startDate).getTime() : now;
          const recentlyStarted = now - startedMs < 12 * 3600 * 1000;
          if (recentlyStarted && !firedRef.current[`${id}:started`]) {
            firedRef.current[`${id}:started`] = true;
            changed = true;
            notifyHackathonStarted(h);
          }
        }

        if (status === 'LIVE' && Number.isFinite(deadlineMs)) {
          const remainingMs = deadlineMs - now;
          if (remainingMs > 0 && remainingMs <= 24 * 3600 * 1000 && !firedRef.current[`${id}:endingSoon`]) {
            firedRef.current[`${id}:endingSoon`] = true;
            changed = true;
            notifyHackathonEndingSoon(h, Math.ceil(remainingMs / (3600 * 1000)));
          }
        }

        if (status === 'ENDED' && prev === 'LIVE' && !firedRef.current[`${id}:ended`]) {
          firedRef.current[`${id}:ended`] = true;
          changed = true;
          notifyHackathonEnded(h);
        }

        if (prev !== status) {
          prevRef.current[id] = status;
          changed = true;
        }
      });

      if (changed) {
        saveJSON(FIRED_KEY, firedRef.current);
        saveJSON(PREV_KEY, prevRef.current);
      }
    };

    evaluate();
    const timer = setInterval(evaluate, 60 * 1000);
    return () => clearInterval(timer);
  }, [hackathons]);
};
