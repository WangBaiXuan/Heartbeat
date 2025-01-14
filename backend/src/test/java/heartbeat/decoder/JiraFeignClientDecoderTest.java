package heartbeat.decoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import feign.Response;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class JiraFeignClientDecoderTest {

	private final ResponseMockUtil responseMock = new ResponseMockUtil();

	private JiraFeignClientDecoder decoder;

	@BeforeEach
	void setup() {
		decoder = new JiraFeignClientDecoder();
	}

	@Test
	void testDecode_UnauthorizedException() {
		int statusCode = HttpStatus.UNAUTHORIZED.value();
		Response response = responseMock.getMockResponse(statusCode);

		Exception exception = decoder.decode("methodKey", response);

		assertEquals(UnauthorizedException.class, exception.getClass());
	}

	@Test
	void testDecode_NotFoundException() {
		int statusCode = HttpStatus.NOT_FOUND.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(NotFoundException.class, exception.getClass());
	}

	@Test
	void testDecode_4xxRequestFailedException() {
		int statusCode = HttpStatus.METHOD_NOT_ALLOWED.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Client Error"));
	}

	@Test
	void testDecode_5xxRequestFailedException() {
		int statusCode = HttpStatus.BAD_GATEWAY.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("Server Error"));
	}

	@Test
	void testDecode_UnKnownException() {
		int statusCode = HttpStatus.SEE_OTHER.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(RequestFailedException.class, exception.getClass());
		assertTrue(exception.getMessage().contains("UnKnown Error"));
	}

	@Test
	void testDecode_HBTimeoutException() {
		int statusCode = HttpStatus.SERVICE_UNAVAILABLE.value();

		Exception exception = decoder.decode("methodKey", responseMock.getMockResponse(statusCode));

		assertEquals(ServiceUnavailableException.class, exception.getClass());
	}

}
