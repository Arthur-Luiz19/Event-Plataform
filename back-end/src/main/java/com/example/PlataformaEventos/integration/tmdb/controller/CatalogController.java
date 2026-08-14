package com.example.PlataformaEventos.integration.tmdb.controller;

import com.example.PlataformaEventos.integration.tmdb.dto.CatalogMovieDto;
import com.example.PlataformaEventos.integration.tmdb.services.TmdbService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Catálogo TMDb", description = "Busca de filmes reais para o wizard do organizador")
@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final TmdbService tmdbService;

    @Operation(
            summary = "Busca filmes no TMDb",
            description = "A chave da API vive no back-end (proxy). Query vazia retorna a lista padrão."
    )
    @GetMapping("/movies")
    public ResponseEntity<List<CatalogMovieDto>> searchMovies(
            @RequestParam(required = false, defaultValue = "") String query) {
        return ResponseEntity.ok(tmdbService.searchMovies(query));
    }
}
