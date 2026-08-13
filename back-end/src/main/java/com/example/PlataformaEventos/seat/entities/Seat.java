package com.example.PlataformaEventos.seat.entities;

import com.example.PlataformaEventos.event.entities.Event;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
        name = "seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_seat_event_row_number",
                        columnNames = {"event_id", "seat_row", "seat_number"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "seat_row", nullable = false, length = 5)
    private String row;

    @Column(name = "seat_number", nullable = false)
    private Integer number;

    public String getLabel() {
        return row + number;
    }
}
