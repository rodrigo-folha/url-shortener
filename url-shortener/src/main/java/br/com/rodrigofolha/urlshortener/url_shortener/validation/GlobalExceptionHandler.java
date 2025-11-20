package br.com.rodrigofolha.urlshortener.url_shortener.validation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ValidationError> handleValidation(ValidationException e) {
        log.error("Validation error: {}", e.getField());

        ValidationError body = new ValidationError(String.valueOf(e.getHttpStatus().value()), "Erro de Validação");
        body.addFieldError(e.getField(), e.getMessage());

        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (e instanceof NotFoundException) {
            status = HttpStatus.NOT_FOUND;
            body.setCodigo(String.valueOf(status.value()));
        }
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ValidationError> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        ValidationError body = new ValidationError("400", "Erro de Validação");
        body.addFieldError("body", "O corpo da requisição não é válido!");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {

        ValidationError body = new ValidationError("400", "Erro de Validação");

        e.getBindingResult().getFieldErrors().forEach(error -> {
            body.addFieldError(error.getField(), error.getDefaultMessage());
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }


}
