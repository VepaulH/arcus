-- Revoke direct EXECUTE on SECURITY DEFINER trigger functions.
-- These are called automatically by PostgreSQL triggers and must not be
-- callable directly by anon or authenticated users.
-- Revoking EXECUTE does NOT affect trigger execution — triggers fire via
-- the trigger mechanism, which is independent of EXECUTE grants.

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

-- rls_auto_enable may not exist in all projects
do $$
begin
  if exists (
    select 1 from pg_proc
    where proname = 'rls_auto_enable'
      and pronamespace = 'public'::regnamespace
  ) then
    revoke execute on function public.rls_auto_enable() from public;
    revoke execute on function public.rls_auto_enable() from anon;
    revoke execute on function public.rls_auto_enable() from authenticated;
  end if;
end $$;
