CREATE TABLE tasks (
    task_id    int         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    int         NOT NULL,
    title      text        NOT NULL CHECK (length(trim(title)) > 0),
    done       boolean     NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);
