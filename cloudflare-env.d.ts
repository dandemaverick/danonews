declare namespace Cloudflare {
 interface Env {
  DB?: D1Database;
  AI?: Ai;
  OPENAI_API_KEY?: string;
  BUCKET?: R2Bucket;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
 }
}
