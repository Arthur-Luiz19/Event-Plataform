package com.example.PlataformaEventos.event.dtos;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventRequestDto(
        @NotNull(message = "O ID do filme é obrigatório")
        Long tmdbMovieId,

        @NotNull(message = "A data e hora do evento são obrigatórias")
        @Future(message = "O evento deve ocorrer no futuro")
        LocalDateTime startDateTime,

        @NotBlank(message = "O local é obrigatório")
        @Size(max = 255)
        String location,

        @NotNull(message = "A capacidade é obrigatória")
        @Positive
        Integer capacity,

        @NotNull(message = "O preço do ingresso é obrigatório")
        @DecimalMin(value = "0.00")
        @Digits(integer = 8, fraction = 2)
        BigDecimal ticketPrice
) {
}
