CREATE TABLE reservations
(
    id         UUID PRIMARY KEY   DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL,
    event_id   UUID      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservations_user
        FOREIGN KEY (user_id)
            REFERENCES users (id),

    CONSTRAINT fk_reservations_event
        FOREIGN KEY (event_id)
            REFERENCES events (id),

    CONSTRAINT uk_reservation_user_event
        UNIQUE (user_id, event_id)
);

CREATE INDEX idx_reservations_user_id
    ON reservations (user_id);

CREATE INDEX idx_reservations_event_id
    ON reservations (event_id);