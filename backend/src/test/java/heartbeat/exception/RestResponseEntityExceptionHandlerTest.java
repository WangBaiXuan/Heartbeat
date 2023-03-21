package heartbeat.exception;

import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RestResponseEntityExceptionHandlerTest {

	@InjectMocks
	private RestResponseEntityExceptionHandler restExceptionHandler;

	@Test
	public void shouldHandleRequestFailedException() {
		RequestFailedException ex = new RequestFailedException(400, "Invalid request");

		ResponseEntity<Object> response = restExceptionHandler.handleRequestFailedException(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Request failed with status statusCode 400, error: Invalid request", errorResponse.getMessage());
	}

	@Test
	public void shouldHandleConflict() {
		RuntimeException ex = new RuntimeException("Invalid argument type");

		ResponseEntity<Object> response = restExceptionHandler.handleConflict(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertEquals("Invalid argument type", errorResponse.getMessage());
	}

	@Test
	@SuppressWarnings("unchecked")
	public void showHandleMethodArgumentNotValid() {
		FieldError fieldError = new FieldError("person", "name", "Name cannot be blank");
		MethodParameter parameter = mock(MethodParameter.class);
		BindingResult result = mock(BindingResult.class);
		when(result.getFieldErrors()).thenReturn(Collections.singletonList(fieldError));
		MethodArgumentNotValidException ex = new MethodArgumentNotValidException(parameter, result);

		ResponseEntity<Object> response = restExceptionHandler.handleMethodArgumentNotValid(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof Map);
		Map<String, String> fieldErrors = (Map<String, String>) response.getBody();
		assertEquals(1, fieldErrors.size());
		assertTrue(fieldErrors.containsKey("name"));
		assertEquals("Name cannot be blank", fieldErrors.get("name"));
	}

	@Test
	public void shouldHandleConstraintViolation() {
		ConstraintViolationException ex = new ConstraintViolationException("ConstraintViolationException", null);

		ResponseEntity<Object> response = restExceptionHandler.handleConstraintViolation(ex);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertTrue(response.getBody() instanceof RestApiErrorResponse);
		RestApiErrorResponse errorResponse = (RestApiErrorResponse) response.getBody();
		assertNotNull(errorResponse.getMessage());
	}

}