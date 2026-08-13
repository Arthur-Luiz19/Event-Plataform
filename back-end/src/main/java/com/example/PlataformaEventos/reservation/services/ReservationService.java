package com.example.PlataformaEventos.reservation.services;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.event.repositories.EventRepository;
import com.example.PlataformaEventos.exception.custom.ConflictException;
import com.example.PlataformaEventos.exception.custom.ForbiddenException;
import com.example.PlataformaEventos.exception.custom.ResourceNotFoundException;
import com.example.PlataformaEventos.reservation.dtos.ReservationRequestDto;
import com.example.PlataformaEventos.reservation.dtos.ReservationResponseDto;
import com.example.PlataformaEventos.reservation.dtos.ReservationSeatRequestDto;
import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.entities.ReservationSeat;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import com.example.PlataformaEventos.reservation.enums.TicketType;
import com.example.PlataformaEventos.reservation.repositories.ReservationRepository;
import com.example.PlataformaEventos.reservation.repositories.ReservationSeatRepository;
import com.example.PlataformaEventos.seat.entities.Seat;
import com.example.PlataformaEventos.seat.repositories.SeatRepository;
import com.example.PlataformaEventos.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final ReservationSeatRepository reservationSeatRepository;

    @Transactional
    public ReservationResponseDto createReservation(ReservationRequestDto dto, User user) {
        Event event = eventRepository.findByIdForUpdate(dto.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));

        List<UUID> seatIds = dto.seats().stream()
                .map(ReservationSeatRequestDto::seatId)
                .toList();

        if (new HashSet<>(seatIds).size() != seatIds.size()) {
            throw new ConflictException("Não é permitido selecionar o mesmo assento mais de uma vez");
        }

        List<Seat> seats = seatRepository.findAllById(seatIds);
        if (seats.size() != seatIds.size()) {
            throw new ResourceNotFoundException("Um ou mais assentos não foram encontrados");
        }

        boolean belongsToEvent = seats.stream()
                .allMatch(seat -> seat.getEvent().getId().equals(event.getId()));
        if (!belongsToEvent) {
            throw new ConflictException("Um ou mais assentos não pertencem ao evento");
        }

        List<ReservationSeat> reservedSeats = reservationSeatRepository.findReservedSeats(
                seatIds,
                event.getId(),
                List.of(ReservationStatus.PENDING_PAYMENT, ReservationStatus.CONFIRMED));
        if (!reservedSeats.isEmpty()) {
            throw new ConflictException("Um ou mais assentos já estão reservados");
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .event(event)
                .build();
        
        Map<UUID, ReservationSeatRequestDto> requestBySeatId = dto.seats().stream()
                .collect(Collectors.toMap(ReservationSeatRequestDto::seatId, Function.identity()));

        BigDecimal total = BigDecimal.ZERO;

        for (Seat seat : seats) {
            ReservationSeatRequestDto seatRequest = requestBySeatId.get(seat.getId());
            BigDecimal price = calculatePrice(event.getTicketPrice(), seatRequest.ticketType());
            total = total.add(price);
            reservation.addReservationSeat(
                    new ReservationSeat(reservation, seat, seatRequest.ticketType(), price));
        }

        reservation.setTotalAmount(total);
        reservation = reservationRepository.save(reservation);
        return new ReservationResponseDto(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDto> findMyReservations(UUID userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ReservationResponseDto::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReservationResponseDto findById(UUID id, User user) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva não encontrada"));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Você não pode acessar esta reserva");
        }

        return new ReservationResponseDto(reservation);
    }

    private BigDecimal calculatePrice(BigDecimal ticketPrice, TicketType ticketType) {
        if (ticketType == TicketType.HALF) {
            return ticketPrice.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        }
        return ticketPrice;
    }
}
