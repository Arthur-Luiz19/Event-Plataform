package com.example.PlataformaEventos.gate.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GateValidationRequestDto(

        @NotBlank(message = "O código do ingresso é obrigatório")
        String code,
        @NotNull(message = "A sessão em atendimento é obrigatória")
        UUID eventId

) {
}
