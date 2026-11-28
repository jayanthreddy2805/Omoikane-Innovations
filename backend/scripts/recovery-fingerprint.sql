-- Aggregate-only validation for a disposable synthetic fixture, never a data export.
SELECT jsonb_build_object(
  'flyway', (SELECT jsonb_agg(jsonb_build_object('version',version,'checksum',checksum,'success',success) ORDER BY installed_rank) FROM flyway_schema_history),
  'contacts', (SELECT count(*) FROM contact_submissions),
  'applications', (SELECT count(*) FROM career_applications),
  'subscribers', (SELECT count(*) FROM email_subscribers),
  'outbox_jobs', (SELECT count(*) FROM email_delivery_jobs),
  'resume_bytes', (SELECT coalesce(sum(octet_length(resume_data)),0) FROM career_applications),
  'resume_sha256', (SELECT encode(sha256(convert_to(coalesce(string_agg(encode(resume_data,'hex'),',' ORDER BY id),''),'UTF8')),'hex') FROM career_applications),
  'indexes', (SELECT jsonb_agg(jsonb_build_object(
    'name', c.relname, 'table', t.relname, 'unique', i.indisunique, 'valid', i.indisvalid,
    'partial', i.indpred IS NOT NULL, 'keys',
    (SELECT jsonb_agg(pg_get_indexdef(i.indexrelid,n,true) ORDER BY n) FROM generate_series(1,i.indnkeyatts) n)
  ) ORDER BY c.relname) FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid
    JOIN pg_class t ON t.oid=i.indrelid JOIN pg_namespace ns ON ns.oid=t.relnamespace WHERE ns.nspname='public')
);

-- pg_dump can reparse equivalent array casts in partial predicates differently.
-- Check predicate behavior instead of comparing its deparsed SQL as a string.
DO $$
DECLARE predicate text; actual text[];
BEGIN
  SELECT pg_get_expr(indpred,indrelid) INTO predicate FROM pg_index
    WHERE indexrelid='public.idx_email_delivery_due'::regclass;
  IF predicate IS NULL THEN RAISE EXCEPTION 'Outbox due index lost its predicate'; END IF;
  EXECUTE 'SELECT array_agg(status ORDER BY status) FROM (VALUES '
    || '(''PENDING''::varchar),(''PROCESSING''::varchar),(''SENT''::varchar),'
    || '(''FAILED''::varchar),(''SKIPPED''::varchar)) fixture(status) WHERE ' || predicate INTO actual;
  IF actual IS DISTINCT FROM ARRAY['PENDING','PROCESSING']::text[] THEN
    RAISE EXCEPTION 'Outbox due-index predicate changed';
  END IF;
END $$;
