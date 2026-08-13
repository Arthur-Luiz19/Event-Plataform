package com.example.PlataformaEventos.reservation.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.UUID;

public record ReservationRequestDto(

        @NotNull(message = "O evento é obrigatório")
        UUID eventId,

        @NotEmpty
        @Valid
        List<ReservationSeatRequestDto> seats

) {
}
