package com.example.PlataformaEventos.reservation.entities;

import com.example.PlataformaEventos.reservation.enums.TicketType;
import com.example.PlataformaEventos.seat.entities.Seat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "reservation_seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_reservation_seat",
                        columnNames = {"reservation_id", "seat_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class ReservationSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type", nullable = false)
    private TicketType ticketType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public ReservationSeat(Reservation reservation, Seat seat, TicketType ticketType, BigDecimal price) {
        this.reservation = reservation;
        this.seat = seat;
        this.ticketType = ticketType;
        this.price = price;
    }

    @PrePersist
    public void prePersist() {
        if (ticketType == null) {
            ticketType = TicketType.FULL;
        }
    }

}