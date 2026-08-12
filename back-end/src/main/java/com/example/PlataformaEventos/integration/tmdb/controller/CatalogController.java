package com.example.PlataformaEventos.integration.tmdb.controller;

import com.example.PlataformaEventos.integration.tmdb.dto.CatalogMovieDto;
import com.example.PlataformaEventos.integration.tmdb.services.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final TmdbService tmdbService;

    @GetMapping("/movies")
    public ResponseEntity<List<CatalogMovieDto>> searchMovies(
            @RequestParam(required = false, defaultValue = "") String query) {
        return ResponseEntity.ok(tmdbService.searchMovies(query));
    }
}
