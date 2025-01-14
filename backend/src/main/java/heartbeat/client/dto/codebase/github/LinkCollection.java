package heartbeat.client.dto.codebase.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkCollection {

	private Self self;

	private Html html;

	private Issue issue;

	private Comment comment;

	@JsonProperty("review_comments")
	private ReviewComments reviewComments;

	@JsonProperty("review_comment")
	private ReviewComment reviewComment;

	private Commits commits;

	private Status status;

}
