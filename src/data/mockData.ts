/**
 * Default/fallback data for when the backend API is unreachable.
 * This data is used ONLY as initialization defaults in stores and components.
 * When the backend is connected, stores will fetch live data and replace these.
 *
 * NOTE: These are NOT mock/fake data for testing. They represent a reasonable
 * "empty state" or minimal sample data for offline/demo mode.
 */

export const PROJECT_TEAM = [
  {
    name: 'Development Team',
    role: 'Full Stack Engineers',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Building the future of hackathon management.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

export const INITIAL_HACKATHONS: Array<Record<string, unknown>> = [];

export const INITIAL_TEAMS: Array<Record<string, unknown>> = [];

export const INITIAL_ANNOUNCEMENTS: Array<Record<string, unknown>> = [];

export const INITIAL_SUBMISSIONS: Array<Record<string, unknown>> = [];

export const INITIAL_VERIFICATIONS: Array<Record<string, unknown>> = [];
