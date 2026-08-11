package com.example.PlataformaEventos.ticket.dtos;

import com.example.PlataformaEventos.ticket.entities.Ticket;
import com.example.PlataformaEventos.ticket.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketResponseDto(
        UUID id,
        String code,
        TicketStatus status,
        String eventTitle,
        LocalDateTime eventStartDateTime,
        String location,
        LocalDateTime createdAt,
        LocalDateTime usedAt
) {

    public TicketResponseDto(Ticket ticket) {
        this(
                ticket.getId(),
                ticket.getCode(),
                ticket.getStatus(),
                ticket.getReservation().getEvent().getTitle(),
                ticket.getReservation().getEvent().getStartDateTime(),
                ticket.getReservation().getEvent().getLocation(),
                ticket.getCreatedAt(),
                ticket.getUsedAt()
        );
    }
}
