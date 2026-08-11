package com.example.PlataformaEventos.reservation.services;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.event.repositories.EventRepository;
import com.example.PlataformaEventos.exception.custom.ConflictException;
import com.example.PlataformaEventos.exception.custom.ResourceNotFoundException;
import com.example.PlataformaEventos.reservation.dtos.ReservationRequestDto;
import com.example.PlataformaEventos.reservation.dtos.ReservationResponseDto;
import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import com.example.PlataformaEventos.reservation.repositories.ReservationRepository;
import com.example.PlataformaEventos.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;

    @Transactional
    public ReservationResponseDto createReservation(ReservationRequestDto dto, User user) {

        Event event = eventRepository
                .findByIdForUpdate(dto.eventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Evento não encontrado"
                        )
                );

        long reservedQuantity =
                reservationRepository.sumQuantityByEventAndStatus(
                        event,
                        List.of(
                                ReservationStatus.PENDING_PAYMENT,
                                ReservationStatus.CONFIRMED
                        )
                );

        if (reservedQuantity + dto.quantity() > event.getCapacity()) {
            throw new ConflictException(
                    "Quantidade de ingressos indisponível"
            );
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .event(event)
                .quantity(dto.quantity())
                .build();

        reservation = reservationRepository.save(reservation);

        return new ReservationResponseDto(reservation);
    }
}
