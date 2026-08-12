package com.example.PlataformaEventos.integration.tmdb.services;

import com.example.PlataformaEventos.exception.custom.BusinessException;
import com.example.PlataformaEventos.exception.custom.ResourceNotFoundException;
import com.example.PlataformaEventos.integration.tmdb.client.TmdbClient;
import com.example.PlataformaEventos.integration.tmdb.dto.CatalogMovieDto;
import com.example.PlataformaEventos.integration.tmdb.dto.TmdbMovieResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TmdbService {

    private final TmdbClient tmdbClient;

    @Value("${tmdb.image-base-url}")
    private String imageBaseUrl;

    public TmdbMovieResponseDto findMovie(Long movieId) {
        try {
            TmdbMovieResponseDto movie = tmdbClient.findMovieById(movieId);
            if (movie.posterPath() == null) {
                return movie;
            }
            return new TmdbMovieResponseDto(
                    movie.id(),
                    movie.title(),
                    movie.overview(),
                    imageBaseUrl + movie.posterPath(),
                    movie.releaseDate()
            );
        } catch (WebClientResponseException.NotFound e) {
            throw new ResourceNotFoundException("Filme não encontrado no TMDb (id " + movieId + ")");
        } catch (WebClientResponseException.Unauthorized e) {
            throw new BusinessException("Chave da API TMDb inválida ou ausente");
        } catch (WebClientResponseException e) {
            throw new BusinessException("Falha ao consultar o TMDb. Tente novamente.");
        }
    }

    // query vazia → populares; senão → busca por título
    public List<CatalogMovieDto> searchMovies(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        try {
            return tmdbClient.searchMovies(query.trim())
                    .stream()
                    .map(this::toCatalog)
                    .toList();
        } catch (WebClientResponseException.Unauthorized e) {
            throw new BusinessException("Chave da API TMDb inválida ou ausente");
        } catch (WebClientResponseException e) {
            throw new BusinessException("Falha ao consultar o catálogo TMDb");
        }
    }

    private CatalogMovieDto toCatalog(TmdbMovieResponseDto movie) {
        return new CatalogMovieDto(
                movie.id(),
                movie.title(),
                movie.posterPath() == null ? null : imageBaseUrl + movie.posterPath(),
                movie.overview(),
                movie.releaseDate()
        );
    }
}
