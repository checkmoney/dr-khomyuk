CREATE TABLE public.progress (
  "id"       varchar NOT NULL,
  "user_id"  varchar NOT NULL,
  "type"     varchar NOT NULL
);

ALTER TABLE ONLY public.progress
  ADD CONSTRAINT "PK_progress" PRIMARY KEY (id);

CREATE INDEX progress_user_id ON progress ("user_id");

#DOWN

DROP TABLE public.progress;
