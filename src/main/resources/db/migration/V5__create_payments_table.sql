CREATE TABLE payments
(
    id             UUID PRIMARY KEY,
    reservation_id UUID           NOT NULL UNIQUE,
    amount         NUMERIC(10, 2) NOT NULL,
    status         VARCHAR(20)    NOT NULL,
    created_at     TIMESTAMP      NOT NULL,
    processed_at   TIMESTAMP,

    CONSTRAINT fk_payment_reservation
        FOREIGN KEY (reservation_id)
            REFERENCES reservations (id)
);