package heartbeat.service.board.jira;

import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
@RequiredArgsConstructor
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	public BoardConfigResponse getJiraReconfiguration(BoardRequest boardRequest) {
		String url = "https://" + boardRequest.getSite() + ".atlassian.net";
		JiraBoardConfigDTO jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(URI.create(url), boardRequest.getBoardId());
		return BoardConfigResponse.builder()
			.id(jiraBoardConfigDTO.getId())
			.name(jiraBoardConfigDTO.getName())
			.build();
	}
}
