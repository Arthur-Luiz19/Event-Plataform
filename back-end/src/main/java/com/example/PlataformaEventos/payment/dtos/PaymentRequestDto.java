package com.example.PlataformaEventos.payment.dtos;

import com.example.PlataformaEventos.payment.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PaymentRequestDto(
        @NotNull(message = "A reserva é obrigatória")
        UUID reservationId,

        @NotNull(message = "O status do pagamento é obrigatório")
        PaymentStatus status
) {
}
