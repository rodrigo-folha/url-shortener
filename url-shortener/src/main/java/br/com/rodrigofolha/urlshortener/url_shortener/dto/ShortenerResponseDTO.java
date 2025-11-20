package br.com.rodrigofolha.urlshortener.url_shortener.dto;

import br.com.rodrigofolha.urlshortener.url_shortener.model.Shortener;

import java.time.LocalDateTime;

public record ShortenerResponseDTO(
        int id,
        String url,
        String shortCode,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static ShortenerResponseDTO valueOf(Shortener shortener) {
        return new ShortenerResponseDTO(
                shortener.getId(),
                shortener.getUrl(),
                shortener.getShortCode(),
                shortener.getCreatedAt(),
                shortener.getUpdatedAt()
        );
    }
}
