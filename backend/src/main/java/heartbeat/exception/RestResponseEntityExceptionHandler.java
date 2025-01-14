package heartbeat.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestResponseEntityExceptionHandler {

	@ExceptionHandler(value = NotFoundException.class)
	protected ResponseEntity<Object> handleNotFoundException(NotFoundException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "404 Not Found"));
	}

	@ExceptionHandler(value = ServiceUnavailableException.class)
	protected ResponseEntity<Object> handleTimeoutException(ServiceUnavailableException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "Service Unavailable"));
	}

	@ExceptionHandler(value = RequestFailedException.class)
	protected ResponseEntity<Object> handleRequestFailedException(RequestFailedException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), ex.getMessage()));
	}

	@ExceptionHandler(value = BadRequestException.class)
	protected ResponseEntity<Object> handleBadRequestException(BadRequestException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "Please reconfirm the input"));
	}

	@ExceptionHandler(value = NoContentException.class)
	protected ResponseEntity<Object> handleNoContentException(NoContentException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "No content"));
	}

	@ExceptionHandler(value = UnauthorizedException.class)
	protected ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "Token is incorrect"));
	}

	@ExceptionHandler(value = RateLimitExceededException.class)
	protected ResponseEntity<Object> handleRateLimitExceededException(RateLimitExceededException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "GitHub api rate limit"));
	}

	@ExceptionHandler(value = PermissionDenyException.class)
	protected ResponseEntity<Object> handlePermissionDenyException(PermissionDenyException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "Permission deny"));
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<Object> handleConflict(RuntimeException ex) {
		return ResponseEntity.badRequest().body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
	public ResponseEntity<Object> handleMethodArgumentNotValid(BindException ex) {
		BindingResult result = ex.getBindingResult();
		Map<String, String> fieldErrors = result.getFieldErrors()
			.stream()
			.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity.badRequest().body(fieldErrors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex) {
		return ResponseEntity.badRequest().body(new RestApiErrorResponse(ex.getMessage()));
	}

	@ExceptionHandler(FileIOException.class)
	public ResponseEntity<Object> handleFileIOException(FileIOException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "File read failed"));
	}

	@ExceptionHandler(InternalServerErrorException.class)
	public ResponseEntity<Object> handleInternalServerErrorException(InternalServerErrorException ex) {
		return ResponseEntity.status(ex.getStatus())
			.body(new RestApiErrorResponse(ex.getStatus(), ex.getMessage(), "Internal Server Error"));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleDefaultErrorException(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(new RestApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage(),
					"Internal Server Error"));
	}

}
