export const categories = ['Ghana', 'Politics', 'Sports', 'Entertainment', 'Business', 'World'];

export type ArticleImage = {url:string;alt:string;caption:string;credit:string};

export type Article = {
  id: string; slug: string; title: string; description: string; body?: string;
  category: string; image: string; imageAlt?: string; credit?: string; author?: string;
  source: string; url?: string; publishedAt: string; status?: string; featured?: number;
  images?: ArticleImage[]; external?: boolean; adEligible?: number;
};

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 110);
}

// A URL-based identity survives headline edits and remains compatible with saved stories.
export function feedArticleId(url: string) {
  let a = 0x811c9dc5, b = 0x9e3779b9;
  for (let i = 0; i < url.length; i++) {
    a = Math.imul(a ^ url.charCodeAt(i), 0x01000193);
    b = Math.imul(b ^ url.charCodeAt(i), 0x85ebca6b);
  }
  return 'feed-' + (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
}

export function articlePath(article: Article) {
  return article.external ? '/story/' + feedArticleId(article.url || article.id)
    : '/article/' + encodeURIComponent(article.slug);
}
