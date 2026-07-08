export const GITHUB_REPO_URL = "https://github.com/nikhilakki/subprime";
export const X_PROFILE_URL = "https://x.com/nik_akki";
export const X_HANDLE = "nik_akki";

const SHARE_MESSAGE =
  "JungleAudit analyzes your Amazon spending entirely in your browser — no uploads, no accounts. Check it out:";

export function getGitHubStarUrl(): string {
  return GITHUB_REPO_URL;
}

export function getXFollowUrl(): string {
  return `https://x.com/intent/follow?screen_name=${X_HANDLE}`;
}

export function getXShareUrl(siteUrl = typeof window !== "undefined" ? window.location.origin : ""): string {
  const text = siteUrl ? `${SHARE_MESSAGE} ${siteUrl}` : SHARE_MESSAGE;
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}