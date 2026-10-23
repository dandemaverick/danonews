-- Public publisher ID supplied by the site owner. Does not enable advertising.
INSERT INTO site_settings (key, value, updated_at)
VALUES ('monetization', '{"publisherId":"ca-pub-1450713720883383"}', datetime('now'))
ON CONFLICT(key) DO UPDATE SET
  value = json_set(site_settings.value, '$.publisherId', 'ca-pub-1450713720883383'),
  updated_at = datetime('now')
WHERE COALESCE(json_extract(site_settings.value, '$.publisherId'), '') = '';
