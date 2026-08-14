package com.example.PlataformaEventos.event.controllers;

import com.example.PlataformaEventos.event.dtos.EventRequestDto;
import com.example.PlataformaEventos.event.dtos.EventResponseDto;
import com.example.PlataformaEventos.event.dtos.UpdateEventRequestDto;
import com.example.PlataformaEventos.event.services.EventService;
import com.example.PlataformaEventos.user.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Eventos", description = "Sessões publicadas pelo organizador")
@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @Operation(
            summary = "Publica um novo evento",
            description = "Somente ORGANIZER. Ao publicar, a grade de assentos é gerada automaticamente."
    )
    @PostMapping
    public ResponseEntity<EventResponseDto> create(
            @Valid @RequestBody EventRequestDto data,
            Authentication authentication
    ) {

        User organizer = (User) authentication.getPrincipal();

        EventResponseDto response =
                eventService.createEvent(data, organizer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(
            summary = "Lista eventos publicados",
            description = "Catálogo público consumido pela home do cliente."
    )
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> findAll() {

        return ResponseEntity.ok(
                eventService.findAll()
        );
    }

    @Operation(
            summary = "Detalha um evento"
    )
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> findById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                eventService.findById(id)
        );
    }

    @Operation(
            summary = "Atualiza um evento",
            description = "Somente o organizador dono do evento. Editar capacidade não regenera assentos já existentes."
    )
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventRequestDto data,
            Authentication authentication
    ) {

        User organizer = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                eventService.updateEvent(
                        id,
                        data,
                        organizer
                )
        );
    }

    @Operation(
            summary = "Remove um evento",
            description = "Somente o organizador dono do evento."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            Authentication authentication
    ) {

        User organizer = (User) authentication.getPrincipal();
        eventService.delete(id, organizer);
        return ResponseEntity.noContent().build();
    }
}
