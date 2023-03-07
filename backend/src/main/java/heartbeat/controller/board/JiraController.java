package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequestParam;
import heartbeat.controller.board.vo.request.BoardType;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.service.board.jira.JiraService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
@Log4j2
public class JiraController {

	private final JiraService jiraService;

	@GetMapping("/{boardType}")
	public BoardConfigResponse getBoard(@PathVariable @NotBlank BoardType boardType,
			@Valid BoardRequestParam boardRequestParam) {
		return jiraService.getJiraConfiguration(boardRequestParam);
	}

}
