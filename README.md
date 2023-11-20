Hello Welcome to this Supabase Starter Project.

This starter repo, has been prepared to handle supabase auth, both with email login, and providers login setup. 

However, before you can start your project, a little setup is needed on your part as well. 

##STEP 1: Setup Enviromental Variables

Start by renaming the env.local.example file to env.local and put your supabase domain and anon key. 

##STEP 2: Setup Tables

Start by using the SQL Editor on supabase, setting up the profiles table:

  `create table
    public.profiles (
      id uuid not null,
      name text null,
      username text null,
      avatar_url text null,
      email text not null,
      constraint profiles_pkey primary key (id),
      constraint profiles_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
    ) tablespace pg_default;`

Afterwards, u can setup a notes table, where every user can own a note:

  `create table
  public.notes (
    id serial,
    title text not null,
    user_id uuid not null,
    constraint notes_pkey primary key (id),
    constraint notes_user_id_fkey foreign key (user_id) references profiles (id) on update cascade on delete cascade
  ) tablespace pg_default;`

Now we make a function which takes our authenticated user, and generates a profiles table in public tables:

  `create function public.create_profile_for_user()
  returns trigger
  language plpgsql
  security definer set search_path = public
  as $$
  begin
    insert into public.profiles (id, name, email, username, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->'name',
      new.raw_user_meta_data->'user_name',
      new.raw_user_meta_data->'avatar_url'
    );
    return new;
  end;
  $$;`

Now we setup a trigger for creating the profiles table, each time a new user authenticates:

  `create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.create_profile_for_user();`