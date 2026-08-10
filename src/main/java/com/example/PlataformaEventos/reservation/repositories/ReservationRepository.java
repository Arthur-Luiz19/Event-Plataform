package com.example.PlataformaEventos.reservation.repositories;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import com.example.PlataformaEventos.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    @Query("""
                SELECT COALESCE(SUM(r.quantity), 0)
                FROM Reservation r
                WHERE r.event = :event
                AND r.status IN :statuses
            """)
    long sumQuantityByEventAndStatus(
            @Param("event") Event event,
            @Param("statuses") Collection<ReservationStatus> statuses
    );
}
