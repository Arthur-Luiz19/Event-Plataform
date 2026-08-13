CREATE TABLE reservation_seats
(
    id             UUID PRIMARY KEY,
    reservation_id UUID           NOT NULL,
    seat_id        UUID           NOT NULL,
    ticket_type    VARCHAR(10)    NOT NULL,
    price          NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_reservation_seat_reservation
        FOREIGN KEY (reservation_id)
            REFERENCES reservations (id),

    CONSTRAINT fk_reservation_seat_seat
        FOREIGN KEY (seat_id)
            REFERENCES seats (id),

    CONSTRAINT uk_reservation_seat
        UNIQUE (reservation_id, seat_id),

    CONSTRAINT chk_reservation_seat_ticket_type
        CHECK (ticket_type IN ('FULL', 'HALF'))
);