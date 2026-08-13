package com.example.PlataformaEventos.event.services;

import com.example.PlataformaEventos.event.dtos.EventRequestDto;
import com.example.PlataformaEventos.event.dtos.EventResponseDto;
import com.example.PlataformaEventos.event.dtos.UpdateEventRequestDto;
import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.event.repositories.EventRepository;
import com.example.PlataformaEventos.integration.tmdb.dto.TmdbMovieResponseDto;
import com.example.PlataformaEventos.integration.tmdb.services.TmdbService;
import com.example.PlataformaEventos.seat.services.SeatService;
import com.example.PlataformaEventos.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final TmdbService tmdbService;
    private final SeatService seatService;

    @Transactional
    public EventResponseDto createEvent(EventRequestDto data, User organizer) {

        TmdbMovieResponseDto movie =
                tmdbService.findMovie(data.tmdbMovieId());

        Event event = Event.builder()
                .tmdbMovieId(movie.id())
                .title(movie.title())
                .description(movie.overview())
                .posterUrl(movie.posterPath())
                .startDateTime(data.startDateTime())
                .location(data.location())
                .capacity(data.capacity())
                .ticketPrice(data.ticketPrice())
                .organizer(organizer)
                .build();

        Event savedEvent = eventRepository.save(event);
        seatService.generateSeatsForEvent(savedEvent);
        return new EventResponseDto(savedEvent);
    }

    @Transactional(readOnly = true)
    public List<EventResponseDto> findAll() {

        return eventRepository.findAll()
                .stream()
                .map(EventResponseDto::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponseDto findById(UUID id) {

        Event event = findEntityById(id);
        return new EventResponseDto(event);
    }

    @Transactional
    public EventResponseDto updateEvent(
            UUID id,
            UpdateEventRequestDto dto,
            User organizer
    ) {

        Event event = findEntityById(id);

        validateOwnership(event, organizer);

        event.setStartDateTime(dto.startDateTime());
        event.setLocation(dto.location());
        event.setCapacity(dto.capacity());
        event.setTicketPrice(dto.ticketPrice());

        return new EventResponseDto(
                eventRepository.save(event)
        );
    }

    @Transactional
    public void delete(
            UUID id,
            User organizer
    ) {

        Event event = findEntityById(id);
        validateOwnership(event, organizer);
        eventRepository.delete(event);
    }

    private Event findEntityById(UUID id) {

        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Evento não encontrado"
                        )
                );
    }

    private void validateOwnership(
            Event event,
            User organizer
    ) {

        if (!event.getOrganizer().getId()
                .equals(organizer.getId())) {

            throw new SecurityException(
                    "Você não possui permissão para alterar este evento"
            );
        }
    }
}
