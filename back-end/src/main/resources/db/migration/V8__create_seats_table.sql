CREATE TABLE seats
(
    id          UUID PRIMARY KEY,
    event_id    UUID       NOT NULL,
    seat_row    VARCHAR(5) NOT NULL,
    seat_number INTEGER    NOT NULL,

    CONSTRAINT fk_seat_event
        FOREIGN KEY (event_id)
            REFERENCES events (id),

    CONSTRAINT uk_seat_event_row_number
        UNIQUE (event_id, seat_row, seat_number)
);