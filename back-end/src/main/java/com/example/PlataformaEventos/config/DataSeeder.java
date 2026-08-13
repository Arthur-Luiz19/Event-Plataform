package com.example.PlataformaEventos.config;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.event.repositories.EventRepository;
import com.example.PlataformaEventos.seat.services.SeatService;
import com.example.PlataformaEventos.user.entities.User;
import com.example.PlataformaEventos.user.enums.Roles;
import com.example.PlataformaEventos.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EventRepository eventRepository;
    private final SeatService seatService;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User organizer = createUser("Organizador", "organizador@email.com", Roles.ROLE_ORGANIZER);
        createUser("Cliente Teste", "cliente@teste.com",  Roles.ROLE_CLIENT);
        createUser("Cliente",       "cliente@email.com",  Roles.ROLE_CLIENT);
        createUser("Portaria",      "portaria@email.com", Roles.ROLE_GATE);

        LocalDateTime week = LocalDateTime.now().plusDays(7).withSecond(0).withNano(0);

        createEvent(organizer, 24428L,
                "Os Vingadores: The Avengers",
                "Loki, o irmão de Thor, ganha acesso ao poder ilimitado do cubo cósmico ao roubá-lo de dentro das instalações da S.H.I.E.L.D. Nick Fury, o diretor desta agência internacional que mantém a paz, logo reúne os únicos super-heróis que serão capazes de defender a Terra de ameaças sem precedentes. Homem de Ferro, Capitão América, Hulk, Thor, Viúva Negra e Gavião Arqueiro formam o time dos sonhos de Fury, mas eles precisam aprender a colocar os egos de lado e agir como um grupo em prol da humanidade.",
                "https://image.tmdb.org/t/p/w500/PtSapjHdDjlVcsqdEo0u7rDE6i.jpg",
                week.plusHours(2), "Cine Noir — Sala 1", 60, new BigDecimal("30.00"));

        createEvent(organizer, 1084244L,
                "Toy Story 5",
                "O trabalho de Buzz, Woody, Jessie e do resto da gangue fica exponencialmente mais difícil quando eles enfrentam uma nova ameaça à diversão: a tecnologia.",
                "https://image.tmdb.org/t/p/w500/sssrBhdvDcczgMQYDc8oCoSuFEJ.jpg",
                week.plusHours(4), "Cine Noir — Sala 2", 100, new BigDecimal("30.00"));

        createEvent(organizer, 1234821L,
                "Jurassic World: Recomeço",
                "Cinco anos após os eventos de Jurassic World: Domínio, a ecologia do planeta se mostrou inóspita para os dinossauros, com os poucos sobreviventes vivendo isolados nas regiões equatoriais. Zora Bennett é contratada para liderar uma equipe de especialistas cujo objetivo é obter o material genético das três maiores criaturas, cujo DNA contém a chave para a criação de um medicamento que trará grandes benefícios à humanidade.",
                "https://image.tmdb.org/t/p/w500/zuEC2i3I2P7QIcLoUJNBwqRYO4S.jpg",
                week.plusHours(6), "Cine Noir — Sala 3", 100, new BigDecimal("30.00"));

        createEvent(organizer, 936075L,
                "Michael",
                "A história da vida de Michael Jackson além da música, traçando sua jornada desde a descoberta de seu talento extraordinário como líder dos Jackson Five até o artista visionário cuja ambição criativa impulsionou uma busca implacável para se tornar o maior artista do mundo.",
                "https://image.tmdb.org/t/p/w500/gXh43JopeO8BlA661BvlkR6yeqs.jpg",
                week.plusHours(8), "Cine Noir — Sala 4", 100, new BigDecimal("30.00"));
    }

    private User createUser(String name, String email, Roles role) {
        return userRepository.save(User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode("1234"))
                .role(role)
                .build());
    }

    private void createEvent(
            User organizer,
            Long tmdbMovieId,
            String title,
            String description,
            String posterUrl,
            LocalDateTime startDateTime,
            String location,
            int capacity,
            BigDecimal ticketPrice
    ) {
        Event event = Event.builder()
                .organizer(organizer)
                .tmdbMovieId(tmdbMovieId)
                .title(title)
                .description(description)
                .posterUrl(posterUrl)
                .startDateTime(startDateTime)
                .location(location)
                .capacity(capacity)
                .ticketPrice(ticketPrice)
                .build();
        seatService.generateSeatsForEvent(eventRepository.save(event));
    }
}
