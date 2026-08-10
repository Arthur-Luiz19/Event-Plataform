package com.example.PlataformaEventos.reservation.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record ReservationRequestDto(

        @NotNull(message = "O evento é obrigatório")
        UUID eventId,

        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantity

) {
}
