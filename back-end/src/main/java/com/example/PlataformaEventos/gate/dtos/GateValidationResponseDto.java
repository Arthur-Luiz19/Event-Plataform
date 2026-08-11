package com.example.PlataformaEventos.gate.dtos;

import com.example.PlataformaEventos.ticket.entities.Ticket;
import com.example.PlataformaEventos.ticket.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record GateValidationResponseDto(
        UUID ticketId,
        String ticketCode,
        TicketStatus status,
        String eventTitle,
        String clientName,
        LocalDateTime usedAt
) {

    public GateValidationResponseDto(Ticket ticket) {
        this(
                ticket.getId(),
                ticket.getCode(),
                ticket.getStatus(),
                ticket.getReservation().getEvent().getTitle(),
                ticket.getReservation().getUser().getName(),
                ticket.getUsedAt()
        );
    }
}
