ALTER TABLE tickets
    ADD COLUMN reservation_seat_id UUID NOT NULL;

ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_reservation_seat
        FOREIGN KEY (reservation_seat_id) REFERENCES reservation_seats (id);

ALTER TABLE tickets
    ADD CONSTRAINT uk_tickets_reservation_seat
        UNIQUE (reservation_seat_id);