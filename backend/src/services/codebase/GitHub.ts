import { Codebase } from "./Codebase";
import { DeployTimes } from "../../models/pipeline/DeployTimes";
import axios, { AxiosInstance } from "axios";
import { JsonConvert } from "json2typescript";
import GitUrlParse from "git-url-parse";
import { GitHubPull } from "../../models/codebase/GitHubPull";
import { CommitInfo } from "../../models/codebase/CommitInfo";
import { LeadTime, PipelineLeadTime } from "../../models/codebase/LeadTime";
import { GitOrganization } from "../../models/codebase/GitOrganization";
import { GitHubRepo } from "../../models/codebase/GitHubRepo";
import logger from "../../utils/loggerUtils";
import { maskEmailResponseLogger } from "../../utils/responseLoggerUtils";

export class GitHub implements Codebase {
  private httpClient: AxiosInstance;

  constructor(token: string) {
    this.httpClient = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github.groot-preview+json",
        Authorization: `token ${token}`,
      },
    });
  }

  async fetchAllOrganization(): Promise<string[]> {
    logger.info(
      `[Github] Start to query all organization_url:${this.httpClient.defaults.baseURL}/user/orgs`
    );
    const response = await this.httpClient.get("/user/orgs");
    maskEmailResponseLogger(
      "[Github] Successfully queried all organization_data",
      response
    );
    const gitOrganizations = new JsonConvert().deserializeArray(
      response.data,
      GitOrganization
    );
    return gitOrganizations.map((org) => org.orgName);
  }

  async fetchAllRepo(gitOrganizations: string[]): Promise<string[]> {
    const result: string[] = [];
    const requestUrl: string[] = [];

    requestUrl.push("user/repos");
    gitOrganizations.forEach((organization) => {
      requestUrl.push(`/orgs/${organization}/repos`);
    });

    await Promise.all(
      requestUrl.map(async (url) => {
        logger.info(`[Github] Start to query all repository_url:${url}`);
        const response = await this.httpClient.get(url);
        maskEmailResponseLogger(
          "[Github] Successfully queried all repository_data",
          response
        );
        const gitHubRepos: GitHubRepo[] = new JsonConvert().deserializeArray(
          response.data,
          GitHubRepo
        );
        gitHubRepos.forEach((repo) => {
          if (!result.includes(repo.repoUrl)) {
            result.push(repo.repoUrl);
          }
        });
      })
    );
    return result;
  }

  async fetchPipelinesLeadTime(
    deployTimes: DeployTimes[],
    repositories: Map<string, string>
  ): Promise<PipelineLeadTime[]> {
    return await Promise.all(
      deployTimes
        .map((deploy) => {
          const repositoryAddress: string = repositories.get(
            deploy.pipelineId
          )!;
          const repository = GitUrlParse(repositoryAddress).full_name;
          return {
            repository: repository,
            deployInfo: deploy.passed,
            pipelineName: deploy.pipelineName,
            pipelineStep: deploy.pipelineStep,
          };
        })
        .map(async (item) => {
          const repository = item.repository;
          const leadTimes: LeadTime[] = await Promise.all(
            item.deployInfo.map(async (deployInfo) => {
              logger.info(
                `[Github] Start to query pipeline leadTime_url:${this.httpClient.defaults.baseURL}/repos/${repository}/commits/${deployInfo.commitId}/pulls`
              );
              const response = await this.httpClient.get(
                `/repos/${repository}/commits/${deployInfo.commitId}/pulls`
              );
              maskEmailResponseLogger(
                "[Github] Successfully queried pipeline leadTime_data",
                response
              );
              const gitHubPulls: GitHubPull[] = new JsonConvert().deserializeArray(
                response.data,
                GitHubPull
              );

              const jobFinishTime: number = new Date(
                deployInfo.jobFinishTime
              ).getTime();
              const pipelineCreateTime: number = new Date(
                deployInfo.pipelineCreateTime
              ).getTime();

              const noMergeDelayTime = new LeadTime(
                deployInfo.commitId,
                pipelineCreateTime,
                jobFinishTime,
                pipelineCreateTime,
                pipelineCreateTime
              );

              if (gitHubPulls.length == 0) {
                return noMergeDelayTime;
              }

              const mergedPull: GitHubPull | undefined = gitHubPulls
                .filter((gitHubPull) => gitHubPull.mergedAt != null)
                .pop();

              if (mergedPull == undefined) {
                return noMergeDelayTime;
              }

              //get the pull request commits.
              logger.info(
                `[Github] Start to query the pull request commits_url:${this.httpClient.defaults.baseURL}/repos/${repository}/pulls/${mergedPull.number}/commits`
              );
              const prResponse = await this.httpClient.get(
                `/repos/${repository}/pulls/${mergedPull.number}/commits`
              );
              maskEmailResponseLogger(
                "[Github] Successfully queried the pull request commits_data",
                prResponse
              );
              const gitHubCommites: CommitInfo[] = new JsonConvert().deserializeArray(
                prResponse.data,
                CommitInfo
              );

              //get the first commit.
              const firstCommit: CommitInfo = gitHubCommites[0];

              return LeadTime.mapFrom(mergedPull, deployInfo, firstCommit);
            })
          );

          return new PipelineLeadTime(
            item.pipelineName,
            item.pipelineStep,
            leadTimes
          );
        })
    );
  }

  async fetchCommitInfo(
    commitId: string,
    repositoryId: string
  ): Promise<CommitInfo> {
    const repository = GitUrlParse(repositoryId).full_name;
    logger.info(
      `[Github] Start to query commit info_url:${this.httpClient.defaults.baseURL}/repos/${repository}/commits/${commitId}`
    );
    const response = await this.httpClient.get(
      `/repos/${repository}/commits/${commitId}`
    );
    maskEmailResponseLogger(
      "[Github] Successfully queried commit info_data",
      response
    );
    const commitInfo: CommitInfo = new JsonConvert().deserializeObject(
      response.data,
      CommitInfo
    );

    return commitInfo;
  }
}
