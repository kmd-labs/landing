import { ProjectCopy, ProjectEntry, ProjectMetadata } from '../i18n/i18n.types';

/**
 * Canonical static configuration for all showcase portfolio projects.
 * Technical URLs, repository links, media assets, and external flags are managed here in one place.
 */
export const PROJECTS_METADATA: readonly ProjectMetadata[] = [
  {
    id: 'el-nino',
    url: 'https://kmd-labs.github.io/el-nino/',
    repoUrl: 'https://github.com/kmd-labs/el-nino',
    poster: 'assets/projects/el-nino.poster.jpg',
    media: 'assets/projects/el-nino.webp',
    previewDurationMs: 3200
  },
  {
    id: 'watershed',
    url: 'https://kmd-labs.github.io/watershed/',
    repoUrl: 'https://github.com/kmd-labs/watershed',
    poster: 'assets/projects/watershed.poster.jpg',
    media: 'assets/projects/watershed.webp',
    previewDurationMs: 5700
  },
  {
    id: 'baltic',
    url: 'https://kmd-labs.github.io/baltic/',
    repoUrl: 'https://github.com/kmd-labs/baltic',
    poster: 'assets/projects/baltic.poster.jpg',
    media: 'assets/projects/baltic.webp',
    previewDurationMs: 6000
  },
  {
    id: 'viadrus-ai',
    url: 'https://viadrus.adriankulik93.workers.dev/',
    secondaryUrl:
      'https://defence-industry-space.ec.europa.eu/orbit-water-tap-11th-cassini-hackathon-2026-05-08_en',
    poster: 'assets/projects/viadrusai.poster.jpg',
    media: 'assets/projects/viadrusai.gif',
    previewDurationMs: 4500,
    isExternal: true
  },
  {
    id: 'golfstrom',
    url: 'https://kmd-labs.github.io/golfstrom/',
    repoUrl: 'https://github.com/kmd-labs/golfstrom',
    poster: 'assets/projects/golfstrom.poster.jpg',
    media: 'assets/projects/golfstrom.webp',
    previewDurationMs: 5200
  },
  {
    id: 'polis-io',
    url: 'https://kmd-labs.github.io/polis-io/',
    repoUrl: 'https://github.com/kmd-labs/polis-io',
    poster: 'assets/projects/polis-io.poster.jpg',
    media: 'assets/projects/polis-io.gif',
    previewDurationMs: 4000
  }
];

/**
 * Merges static project metadata with localized project copy.
 * Preserves the exact sequence defined in PROJECTS_METADATA.
 */
export function buildProjects(copies: ProjectCopy[]): ProjectEntry[] {
  const copyById = new Map(copies.map((c) => [c.id, c]));
  return PROJECTS_METADATA.map((meta) => {
    const copy = copyById.get(meta.id);
    if (!copy) {
      throw new Error(`[buildProjects] Missing copy definition for project id "${meta.id}"`);
    }
    return {
      ...meta,
      ...copy
    };
  });
}
