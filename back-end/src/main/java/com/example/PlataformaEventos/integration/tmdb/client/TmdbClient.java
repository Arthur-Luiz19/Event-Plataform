package com.example.PlataformaEventos.integration.tmdb.client;

import com.example.PlataformaEventos.integration.tmdb.dto.TmdbMovieResponseDto;
import com.example.PlataformaEventos.integration.tmdb.dto.TmdbSearchResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TmdbClient {

    private final WebClient tmdbWebClient;

    @Value("${tmdb.api-key}")
    private String apiKey;

    public TmdbMovieResponseDto findMovieById(Long movieId) {

        return tmdbWebClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{movieId}")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "pt-BR")
                        .build(movieId)
                )
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        ClientResponse::createException
                )
                .onStatus(
                        HttpStatusCode::is5xxServerError,
                        ClientResponse::createException
                )
                .bodyToMono(TmdbMovieResponseDto.class)
                .block();
    }

    public List<TmdbMovieResponseDto> searchMovies(String query) {
        TmdbSearchResponseDto body = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "pt-BR")
                        .queryParam("query", query)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, ClientResponse::createException)
                .onStatus(HttpStatusCode::is5xxServerError, ClientResponse::createException)
                .bodyToMono(TmdbSearchResponseDto.class)
                .block();
        return body == null || body.results() == null ? List.of() : body.results();
    }
}
