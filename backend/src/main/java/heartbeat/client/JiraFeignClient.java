package heartbeat.client;

import heartbeat.client.dto.JiraBoardConfigDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.net.URI;

@FeignClient(value = "jiraFeignClient", url = "https://this-is-a-placeholder.com")
public interface JiraFeignClient {
	@GetMapping(path = "/rest/agile/1.0/board/{boardId}/configuration")
	JiraBoardConfigDTO getJiraBoardConfiguration(URI baseUrl, @PathVariable String boardId);
}
