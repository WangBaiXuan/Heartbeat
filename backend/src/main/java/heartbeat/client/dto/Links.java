package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Links {

	private Self self;

	private Html html;

	private Issue issue;

	private Comments comments;

	@JsonProperty("review_comments")
	private ReviewComments reviewComments;

	@JsonProperty("review_comment")
	private ReviewComment reviewComment;

	private Commits commits;

	private Statuses statuses;

}
