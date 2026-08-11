package com.example.PlataformaEventos.ticket.repositories;

import com.example.PlataformaEventos.ticket.entities.Ticket;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    Optional<Ticket> findByIdAndReservationUserId(
            UUID ticketId,
            UUID userId
    );

    @Query("""
            SELECT t
            FROM Ticket t
            JOIN FETCH t.reservation r
            JOIN FETCH r.event
            JOIN FETCH r.user
            WHERE r.user.id = :userId
            """)
    List<Ticket> findByReservationUserIdWithDetails(
            @Param("userId") UUID userId
    );

    boolean existsByCode(String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT t
            FROM Ticket t
            JOIN FETCH t.reservation r
            JOIN FETCH r.event
            JOIN FETCH r.user
            WHERE t.code = :code
            """)
    Optional<Ticket> findByCodeForUpdate(
            @Param("code") String code
    );
}
