CREATE TABLE tickets
(
    id             UUID PRIMARY KEY,
    reservation_id UUID        NOT NULL,
    code           VARCHAR(64) NOT NULL UNIQUE,
    status         VARCHAR(20) NOT NULL,
    created_at     TIMESTAMP   NOT NULL,
    used_at        TIMESTAMP,

    CONSTRAINT fk_ticket_reservation
        FOREIGN KEY (reservation_id)
            REFERENCES reservations (id)
);