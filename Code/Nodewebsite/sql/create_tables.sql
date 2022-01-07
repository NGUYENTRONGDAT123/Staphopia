CREATE TABLE public.user_favorites
(
    email text COLLATE pg_catalog."default",
    sample_id integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_favorites
    OWNER to staphbook;
	
CREATE TABLE public.registered_users
(
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default",
    organisation text COLLATE pg_catalog."default",
    occupation text COLLATE pg_catalog."default",
    favourited "char"[],
    "recentSearches" "char"[],
    CONSTRAINT registered_users_pkey PRIMARY KEY (email)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.registered_users
    OWNER to staphbook;

INSERT INTO public.registered_users (email)
    VALUES ('_public_all_users_');

CREATE TABLE public.groups
(
    group_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email text COLLATE pg_catalog."default" NOT NULL,
    name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    created timestamp with time zone,
    modified timestamp with time zone,
    CONSTRAINT groups_pkey PRIMARY KEY (group_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.groups
    OWNER to staphbook;

CREATE TABLE public.group_samples
(
    group_id integer NOT NULL,
    sample_id integer NOT NULL,
    CONSTRAINT "unique group samples" UNIQUE (group_id, sample_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.group_samples
    OWNER to staphbook;

CREATE TABLE public.group_sharing
(
    group_id integer NOT NULL,
    share_to_email text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT group_sharing_pkey PRIMARY KEY (group_id, share_to_email),
    CONSTRAINT existing_groups FOREIGN KEY (group_id)
        REFERENCES public.groups (group_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT existing_users FOREIGN KEY (share_to_email)
        REFERENCES public.registered_users (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.group_sharing
    OWNER to staphbook;
