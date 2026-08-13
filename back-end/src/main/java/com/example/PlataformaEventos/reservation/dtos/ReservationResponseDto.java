package com.example.PlataformaEventos.reservation.dtos;

import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.entities.ReservationSeat;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import com.example.PlataformaEventos.reservation.enums.TicketType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ReservationResponseDto(
        UUID id,
        UUID eventId,
        String eventTitle,
        UUID userId,
        String userName,
        ReservationStatus status,
        LocalDateTime createdAt,
        BigDecimal totalAmount,
        List<SeatItem> seats
) {
    public record SeatItem(
            UUID seatId,
            String seatLabel,
            String seatRow,
            Integer seatNumber,
            TicketType ticketType,
            BigDecimal price
    ) {
        SeatItem(ReservationSeat reservationSeat) {
            this(
                    reservationSeat.getSeat().getId(),
                    reservationSeat.getSeat().getLabel(),
                    reservationSeat.getSeat().getRow(),
                    reservationSeat.getSeat().getNumber(),
                    reservationSeat.getTicketType(),
                    reservationSeat.getPrice()
            );
        }
    }

    public ReservationResponseDto(Reservation reservation) {
        this(
                reservation.getId(),
                reservation.getEvent().getId(),
                reservation.getEvent().getTitle(),
                reservation.getUser().getId(),
                reservation.getUser().getName(),
                reservation.getStatus(),
                reservation.getCreatedAt(),
                reservation.getTotalAmount(),
                reservation.getReservationSeats().stream()
                        .map(SeatItem::new)
                        .toList()
        );
    }
}
