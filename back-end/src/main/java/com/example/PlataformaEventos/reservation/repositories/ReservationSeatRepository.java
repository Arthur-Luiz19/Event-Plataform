package com.example.PlataformaEventos.reservation.repositories;

import com.example.PlataformaEventos.reservation.entities.ReservationSeat;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ReservationSeatRepository extends JpaRepository<ReservationSeat, Integer> {

    List<ReservationSeat> findByReservationId(UUID reservationId);

    @Query("""
            SELECT rs
            FROM ReservationSeat rs
            JOIN FETCH rs.reservation r
            WHERE rs.seat.id IN :seatIds
            AND r.event.id = :eventId
            AND r.status IN :statuses
            """)
    List<ReservationSeat> findReservedSeats(
            @Param("seatIds") Collection<UUID> seatIds,
            @Param("eventId") UUID eventId,
            @Param("statuses") Collection<ReservationStatus> statuses
    );


}
