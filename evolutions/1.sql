CREATE TABLE public.transaction_snapshots (
  "id"       varchar                     NOT NULL,
  "amount"   varchar                     NOT NULL,
  "currency" char(3)                     NOT NULL,
  "date"     timestamp without time zone NOT NULL,
  "category" varchar                     NOT NULL,
  "user_id"  varchar                     NOT NULL
);

ALTER TABLE ONLY public.transaction_snapshots
  ADD CONSTRAINT "PK_transaction_snapshots" PRIMARY KEY (id);

CREATE INDEX transaction_snapshots_user_id ON transaction_snapshots ("user_id");

#DOWN

DROP TABLE public.transaction_snapshots;
