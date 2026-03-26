import { describe, expect, it } from 'vitest';
import { getYoutubeExplainers } from '../../lib/career-pathway/resources';

describe('getYoutubeExplainers', () => {
  it('returns youtubeExplainers when present', () => {
    const result = getYoutubeExplainers({
      startHere: { title: 'Start', url: 'https://example.com', timeMinutes: 15 },
      learning: [],
      youtubeExplainers: [
        {
          title: 'Video 1',
          url: 'https://www.youtube.com/watch?v=one',
          description: 'First video',
        },
        {
          title: 'Video 2',
          url: 'https://www.youtube.com/watch?v=two',
          description: 'Second video',
        },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[1].title).toBe('Video 2');
  });

  it('falls back to youtubeExplainer when needed', () => {
    const result = getYoutubeExplainers({
      startHere: { title: 'Start', url: 'https://example.com', timeMinutes: 15 },
      learning: [],
      youtubeExplainer: {
        title: 'Fallback video',
        url: 'https://www.youtube.com/watch?v=fallback',
        description: 'Fallback description',
      },
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fallback video');
  });
});
