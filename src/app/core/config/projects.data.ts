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
    media: 'assets/projects/el-nino.gif'
  },
  {
    id: 'watershed',
    url: 'https://kmd-labs.github.io/watershed/',
    repoUrl: 'https://github.com/kmd-labs/watershed',
    poster: 'assets/projects/watershed.poster.jpg',
    media: 'assets/projects/watershed.gif'
  },
  {
    id: 'baltic',
    url: 'https://kmd-labs.github.io/baltic/',
    repoUrl: 'https://github.com/kmd-labs/baltic',
    poster: 'assets/projects/baltic.poster.jpg',
    media: 'assets/projects/baltic.gif'
  },
  {
    id: 'viadrus-ai',
    url: 'https://viadrus.adriankulik93.workers.dev/',
    secondaryUrl:
      'https://defence-industry-space.ec.europa.eu/orbit-water-tap-11th-cassini-hackathon-2026-05-08_en',
    poster: 'assets/projects/viadrusai.poster.jpg',
    media: 'assets/projects/viadrusai.gif',
    isExternal: true
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
