package br.com.rodrigofolha.urlshortener.url_shortener.validation;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ValidationException extends RuntimeException{

    private final String field;
    private final HttpStatus httpStatus;

    public ValidationException(String field, String message) {
        super(message);
        this.field = field;
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

}
