declare namespace Cloudflare {
 interface Env {
  DB?: D1Database;
  AI?: Ai;
  BUCKET?: R2Bucket;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
 }
}
