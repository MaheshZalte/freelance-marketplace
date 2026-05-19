package com.freelance.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // VALIDATION ERRORS
    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )

    @ResponseStatus(HttpStatus.BAD_REQUEST)

    public Map<String, String> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> {

                    errors.put(

                            error.getField(),

                            error.getDefaultMessage()
                    );
                });

        return errors;
    }

    // RUNTIME ERRORS
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeErrors(RuntimeException ex) {

        HttpStatus status = HttpStatus.BAD_REQUEST;

        String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";

        if (msg.contains("unauthorized") || msg.contains("invalid token") || msg.contains("unauthenticated") ) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (msg.contains("forbidden") || msg.contains("not allowed")) {
            status = HttpStatus.FORBIDDEN;
        } else if (msg.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, status);
    }

}
