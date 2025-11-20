package br.com.rodrigofolha.urlshortener.url_shortener.validation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {
    private String codigo;
    private String message;

    public ErrorResponse(String codigo, String message) {
        this.codigo = codigo;
        this.message = message;
    }
}
