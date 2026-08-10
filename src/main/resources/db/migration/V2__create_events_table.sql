CREATE TABLE events
(
    id              UUID PRIMARY KEY        DEFAULT gen_random_uuid(),

    tmdb_movie_id   BIGINT         NOT NULL,

    title           VARCHAR(255)   NOT NULL,

    description     TEXT,

    poster_url      VARCHAR(500),

    start_date_time TIMESTAMP      NOT NULL,

    location        VARCHAR(255)   NOT NULL,

    capacity        INTEGER        NOT NULL,

    ticket_price    NUMERIC(10, 2) NOT NULL,

    organizer_id    UUID           NOT NULL,

    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_organizer
        FOREIGN KEY (organizer_id)
            REFERENCES users (id),

    CONSTRAINT chk_events_capacity
        CHECK (capacity > 0),

    CONSTRAINT chk_events_ticket_price
        CHECK (ticket_price >= 0)
);

CREATE INDEX idx_events_organizer_id
    ON events (organizer_id);

CREATE INDEX idx_events_tmdb_movie_id
    ON events (tmdb_movie_id);

CREATE INDEX idx_events_start_date_time
    ON events (start_date_time);