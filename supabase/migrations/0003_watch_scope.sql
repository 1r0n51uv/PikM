-- Scope app Watch: stato sessione (pausa/annulla), timer riposo
-- configurabile per esercizio, preferenze haptics. Vedi
-- docs/adr/0016-watch-app-scope.md

alter table workout_sessions
  add column if not exists status text not null default 'completed'
    check (status in ('active', 'paused', 'completed', 'cancelled'));

-- Sessioni già esistenti create prima di questa colonna sono considerate
-- 'completed' se hanno ended_at, altrimenti 'active'.
update workout_sessions set status = 'active' where ended_at is null;

alter table routine_exercises
  add column if not exists auto_start_rest_timer boolean not null default true,
  add column if not exists haptics_override jsonb;

alter table profiles
  add column if not exists watch_settings jsonb not null default '{
    "restEndHaptic": true,
    "setCompleteHaptic": true,
    "sessionCompleteHaptic": true,
    "restThresholdHaptic": false
  }'::jsonb;
