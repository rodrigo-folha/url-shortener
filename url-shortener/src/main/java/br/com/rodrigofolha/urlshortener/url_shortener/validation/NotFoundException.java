package br.com.rodrigofolha.urlshortener.url_shortener.validation;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends ValidationException{
    public NotFoundException(String field, String message) {
        super(field, message);
    }
}
