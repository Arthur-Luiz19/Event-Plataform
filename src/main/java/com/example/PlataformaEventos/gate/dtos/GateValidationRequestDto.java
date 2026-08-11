package com.example.PlataformaEventos.gate.dtos;

import jakarta.validation.constraints.NotBlank;

public record GateValidationRequestDto(

        @NotBlank(message = "O código do ingresso é obrigatório")
        String code
) {
}
