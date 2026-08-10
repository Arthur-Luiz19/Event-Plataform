package com.example.PlataformaEventos.event.dtos;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.user.entities.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record EventResponseDto(
        UUID id,
        Long tmdbMovieId,
        String title,
        String description,
        String posterUrl,
        LocalDateTime startDateTime,
        String location,
        Integer capacity,
        BigDecimal ticketPrice,
        UUID organizerId,
        String organizerName,
        LocalDateTime createdAt
) {

    public EventResponseDto(Event event) {
        this(
                event.getId(),
                event.getTmdbMovieId(),
                event.getTitle(),
                event.getDescription(),
                event.getPosterUrl(),
                event.getStartDateTime(),
                event.getLocation(),
                event.getCapacity(),
                event.getTicketPrice(),
                event.getOrganizer().getId(),
                event.getOrganizer().getName(),
                event.getCreatedAt()
        );
    }
}
