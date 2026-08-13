package com.example.PlataformaEventos.ticket.dtos;

import com.example.PlataformaEventos.reservation.enums.TicketType;
import com.example.PlataformaEventos.ticket.entities.Ticket;
import com.example.PlataformaEventos.ticket.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketResponseDto(
        UUID id,
        String code,
        String shareToken,
        TicketStatus status,
        LocalDateTime usedAt,
        String eventTitle,
        String eventLocation,
        LocalDateTime eventStartDateTime,
        String seatLabel,
        TicketType ticketType
) {
    public TicketResponseDto(Ticket ticket) {
        this(
                ticket.getId(),
                ticket.getCode(),
                ticket.getShareToken(),
                ticket.getStatus(),
                ticket.getUsedAt(),
                ticket.getReservation().getEvent().getTitle(),
                ticket.getReservation().getEvent().getLocation(),
                ticket.getReservation().getEvent().getStartDateTime(),
                ticket.getReservationSeat().getSeat().getLabel(),
                ticket.getReservationSeat().getTicketType()
        );
    }
}
