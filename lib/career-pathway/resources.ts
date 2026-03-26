import type { Career } from './types';

export function getYoutubeExplainers(resources: Career['resources']) {
  if (resources.youtubeExplainers?.length) {
    return resources.youtubeExplainers;
  }

  return resources.youtubeExplainer ? [resources.youtubeExplainer] : [];
}
