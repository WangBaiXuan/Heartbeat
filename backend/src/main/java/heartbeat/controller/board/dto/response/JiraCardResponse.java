package heartbeat.controller.board.dto.response;

import heartbeat.client.dto.board.jira.JiraCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JiraCardResponse {

	private JiraCard baseInfo;

	private List<CycleTimeInfo> cycleTime;

	private List<CycleTimeInfo> originCycleTime;

	private CardCycleTime cardCycleTime;

}
