package com.example.PlataformaEventos.payment.dtos;

import com.example.PlataformaEventos.payment.entities.Payment;
import com.example.PlataformaEventos.payment.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PaymentResponseDto(
        UUID id,
        UUID reservationId,
        BigDecimal amount,
        PaymentStatus status,
        LocalDateTime createdAt,
        LocalDateTime processedAt
) {

    public PaymentResponseDto(Payment payment) {
        this(
                payment.getId(),
                payment.getReservation().getId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getCreatedAt(),
                payment.getProcessedAt()
        );
    }
}
