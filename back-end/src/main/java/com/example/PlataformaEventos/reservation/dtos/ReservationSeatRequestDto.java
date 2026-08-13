package com.example.PlataformaEventos.reservation.dtos;

import com.example.PlataformaEventos.reservation.enums.TicketType;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ReservationSeatRequestDto(
        @NotNull
        UUID seatId,

        @NotNull
        TicketType ticketType
) {
}