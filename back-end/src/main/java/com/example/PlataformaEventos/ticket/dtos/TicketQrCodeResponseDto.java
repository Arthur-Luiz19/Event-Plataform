package com.example.PlataformaEventos.ticket.dtos;

import java.util.UUID;

public record TicketQrCodeResponseDto(
        UUID ticketId,
        String ticketCode,
        String qrCode
) {
}
