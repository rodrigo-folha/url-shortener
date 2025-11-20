package br.com.rodrigofolha.urlshortener.url_shortener.dto;

import jakarta.validation.constraints.NotBlank;

public record ShortenerDTO(
        @NotBlank(message = "A url deve ser informada")
        String url,
        String urlPersonalizada
) {
}
