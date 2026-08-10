package com.example.PlataformaEventos.reservation.dtos;

import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationResponseDto(
        UUID id,
        UUID eventId,
        String eventTitle,
        UUID userId,
        String userName,
        Integer quantity,
        ReservationStatus status,
        LocalDateTime createdAt
) {

    public ReservationResponseDto(Reservation reservation) {
        this(
                reservation.getId(),
                reservation.getEvent().getId(),
                reservation.getEvent().getTitle(),
                reservation.getUser().getId(),
                reservation.getUser().getName(),
                reservation.getQuantity(),
                reservation.getStatus(),
                reservation.getCreatedAt()
        );
    }
}
