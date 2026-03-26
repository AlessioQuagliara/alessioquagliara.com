import { GithubRepo } from "@/types/github";

const GITHUB_API = "https://api.github.com";

type GithubConfig = {
  username: string | null;
  token: string | null;
  featuredRepoNames: Set<string>;
};

function getConfig(): GithubConfig {
  const username = process.env.GITHUB_USERNAME?.trim() || null;
  const token = process.env.GITHUB_TOKEN?.trim() || null;
  const featuredRepoNames = new Set(
    (process.env.GITHUB_FEATURED_REPOS || "")
      .split(",")
      .map((repo) => repo.trim().toLowerCase())
      .filter(Boolean)
  );

  return { username, token, featuredRepoNames };
}

function getHeaders(
  token: string | null,
  accept = "application/vnd.github+json"
) {
  return {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getFetchOptions() {
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" as const };
  }

  return { next: { revalidate: 300 } };
}

function repoHasFeaturedTopic(repo: GithubRepo): boolean {
  return (repo.topics || []).some((topic) => topic.toLowerCase() === "featured");
}

async function hydrateRepoTopics(
  repos: GithubRepo[],
  username: string,
  token: string | null
): Promise<GithubRepo[]> {
  const reposNeedingTopics = repos.filter((repo) => (repo.topics || []).length === 0);

  if (reposNeedingTopics.length === 0) {
    return repos;
  }

  const hydrated = await Promise.all(
    repos.map(async (repo) => {
      if ((repo.topics || []).length > 0) {
        return repo;
      }

      try {
        const res = await fetch(`${GITHUB_API}/repos/${username}/${repo.name}/topics`, {
          headers: getHeaders(token),
          ...getFetchOptions(),
        });

        if (!res.ok) {
          return repo;
        }

        const payload: { names?: string[] } = await res.json();
        if (!Array.isArray(payload.names)) {
          return repo;
        }

        return { ...repo, topics: payload.names };
      } catch {
        return repo;
      }
    })
  );

  return hydrated;
}

export async function getFeaturedRepos(): Promise<GithubRepo[]> {
  const { username, token, featuredRepoNames } = getConfig();

  if (!username) {
    return [];
  }

  try {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: getHeaders(token),
        ...getFetchOptions(),
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch repositories: ${res.status}`);
      return [];
    }

    const repos: GithubRepo[] = await res.json();
    const nonForkRepos = repos.filter((repo) => !repo.fork);
    const reposWithTopics = await hydrateRepoTopics(nonForkRepos, username, token);

    const featuredByTopic = reposWithTopics.filter(repoHasFeaturedTopic);

    const featuredByEnv = reposWithTopics.filter((repo) =>
      featuredRepoNames.has(repo.name.toLowerCase())
    );

    const featuredRepos = [...featuredByTopic, ...featuredByEnv].filter(
      (repo, index, array) =>
        array.findIndex((candidate) => candidate.id === repo.id) === index
    );

    if (featuredRepos.length > 0) {
      return featuredRepos.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }

    // Fallback: if no featured repos are detected, show recent public repos.
    return reposWithTopics
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

export async function getRepoByName(name: string): Promise<GithubRepo | null> {
  const { username, token } = getConfig();

  if (!username) {
    return null;
  }

  try {
    const res = await fetch(`${GITHUB_API}/repos/${username}/${name}`, {
      headers: getHeaders(token),
      ...getFetchOptions(),
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

export async function getRepoReadme(name: string): Promise<string | null> {
  const { username, token } = getConfig();

  if (!username) {
    return null;
  }

  try {
    const res = await fetch(`${GITHUB_API}/repos/${username}/${name}/readme`, {
      headers: getHeaders(token, "application/vnd.github.raw+json"),
      ...getFetchOptions(),
    });

    if (!res.ok) {
      return null;
    }

    return res.text();
  } catch {
    return null;
  }
}
