package com.example.PlataformaEventos.ticket.dtos;

import com.example.PlataformaEventos.ticket.enums.TicketStatus;

import java.time.LocalDateTime;

public record TicketShareResponseDto(
        String eventTitle,
        String posterUrl,
        LocalDateTime startDateTime,
        String location,
        TicketStatus status
) {
}
