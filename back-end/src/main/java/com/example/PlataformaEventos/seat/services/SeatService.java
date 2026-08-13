package com.example.PlataformaEventos.seat.services;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import com.example.PlataformaEventos.reservation.repositories.ReservationSeatRepository;
import com.example.PlataformaEventos.seat.dto.SeatResponseDto;
import com.example.PlataformaEventos.seat.entities.Seat;
import com.example.PlataformaEventos.seat.repositories.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final ReservationSeatRepository reservationSeatRepository;

    @Transactional
    public void generateSeatsForEvent(Event event) {
        List<Seat> seats = new ArrayList<>();
        int remaining = event.getCapacity();
        for (int r = 0; remaining > 0; r++) {
            String row = String.valueOf((char) ('A' + r));
            int inRow = Math.min(10, remaining);
            for (int n = 1; n <= inRow; n++) {
                seats.add(new Seat(null, event, row, n));
            }
            remaining -= inRow;
        }
        seatRepository.saveAll(seats);
    }

    @Transactional()
    public List<SeatResponseDto> listByEvent(UUID eventId) {
        List<Seat> seats = seatRepository.findByEventIdOrderByRowAscNumberAsc(eventId);
        if (seats.isEmpty()) {
            return List.of();
        }

        List<UUID> seatIds = seats.stream().map(Seat::getId).toList();

        Set<UUID> reservedIds = reservationSeatRepository
                .findReservedSeats(
                        seatIds,
                        eventId,
                        List.of(ReservationStatus.PENDING_PAYMENT, ReservationStatus.CONFIRMED))
                .stream()
                .map(rs -> rs.getSeat().getId())
                .collect(Collectors.toSet());

        return seats.stream()
                .map(seat -> new SeatResponseDto(seat, reservedIds.contains(seat.getId())))
                .toList();
    }
}
