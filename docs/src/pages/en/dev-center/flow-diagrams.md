---
title: Flow Diagram
description: Flow Diagram
layout: ../../../layouts/MainLayout.astro
---

## Calculate Velocity

```plantuml
@startuml velocity
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Calculate velocity
start
:input startTime, endTime, allDoneCardsInfo/
partition "Calculate Velocity of JiraBoard" {
  :sum of all done cards Story Points;
  :sum of cards number;
}
:output Velocity /
stop
@enduml
```

## Calculate Cycle Time

```plantuml
@startuml Cycle Time
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Calculate Cycle Time
start
:input startTime, endTime, cardHistory, boardColumns/
partition "Calculate Cycle Time for each cards" {
  :iterate over DoneCards;
    :calculate card cost time for each column;
}
:output CycleTimeInfoList/
:input CycleTimeInfoList, storyPointSum and cardNumber/
partition "Calculate Cycle Time" {
:iterate over CycleTimeInfoList;
 :initialize jira board columns name as nameMap;
 :initialize jira board columns cost time as cycleTimeMap;
  :calculate Average Cycle Time
  (sum of total Cycle Time / storyPointSum)
  (sum of total Cycle Time / cardNumber);
  :calculate Average Column Cycle Time
  (sum of column total Cycle Time / storyPointSum)
  (sum of column total Cycle Time / cardNumber);
  :calculate proportion of column Cycle Time in total Cycle Time
  (column Cycle Time / total Cycle Time);
}

:output CycleTime /
stop
@enduml
```

## Calculate Classification

```plantuml
@startuml Classification
skin rose
title FlowChart - Heartbeat - Calculate Classification
start
:input cards, targetFields/
:filter targetFields which flag is true;
  :iterate over targetFields;
    :put innerMap with "None" key, cardsNumber;
    :put resultMap with "targetField key", innerMap;
    :put nameMap with "targetFieldkey", "targetFieldName";
    :iterate cardsJiraCardDTOList to get jiraCardResponse;
:get cardsNumber, cardsJiraCardDTOList;
partition "Calculate Classification" {
  :initialize classificationFields List;
    :get jiraCardFields from jiraCardResponse.BaseInfo.fields;
    :extract tempFields(Map<String, Object>) from jiraCardFields;
    :iterate tempFields.keySet to get tempfieldKey;
    :get object in tempFields by tempfieldKey;
    if (object > 0) then (yes)
    :calculate countMap by resultMap, tempfieldKey, object;
      :get countMap(<Map<String, Integer>>) from resultMap by fieldsKey;
      if (countMap!= null) then (yes)
        :iterate object;
        if (object follow ICardFieldDisplayName Interface) then (yes)
        :get displayName from object;
        else (no)
        :transfer object to String as displayName;
        endif
        :get count from countMap by displayName;
            if (count != null) then (yes)
            :put displayName and count + 1 in countMap;
            else (no)
            :put displayName and count = 1 in countMap;
            endif
            :put None_Key , count of None_Key -1 in countMap;
    endif
    else (no)
      :get countMap from resultMap by fieldsKey;
      :iterate object;
        if (object follow ICardFieldDisplayName Interface) then (yes)
        :get displayName from object;
        else (no)
        :transfer object to String as displayName;
        endif
      :get count from countMap by displayName;
        if (count > 0) then (yes)
          :put displayName and count + 1 in countMap;
        else (no)
          :put displayName and count = 1 in countMap;
        endif
        :put None_Key , count of None_Key -1 in countMap;
    endif
    :iterate entry in resultMap;
    :get fieldName and valueMap(Map<String, Integer>);
    :intialize classificationNameValuePair;
      if (count of valueMap for None_Key = 0 ) then (yes)
        :valueMap remove None_Key;
      else (no)
      endif
    :iterate mapEntry in valueMap;
      :get displayName, count from mapEntry;
      :calculate result of count / cardsNumber;
      :put displayName and result in classificationNameValuePair;
      :get fieldName from nameMap;
      :put fieldName and classificationNameValuePair in classificationFields;
}
:output classificationFields/

stop
@enduml
```

## Calculate Deployment Frequency

```plantuml
@startuml deployment frequency
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Calculate deployment frequency
start
:input deployTimes, startTime, endTime/
:calculate time period between startDate and endDate;
partition "Calculate Deployment Frequency of Pipelines" {
  :iterate over DeployTimes;
  :initialize DeploymentFrequencyOfPipelineList;
    :filter passed DeployInfos by time;
    :get passed DeployInfos count;
    if (passedDeployInfosCount is 0 or timePeriod is 0) then (yes)
      :set deployment frequency to 0;
    else (no)
      :calculate deployment frequency(passedDeployTimes / timePeriod);
    endif
    :statistics daily deployment counts;
    :create DeploymentFrequencyOfPipeline
    with pipelineName, pipelineStep, dailyDeploymentCounts and deployment frequency;
    :put DeploymentFrequencyOfPipeline to DeploymentFrequencyOfPipelineList;
  :output List<DeploymentFrequencyOfPipeline> /
}
partition "Calculate Average Deployment Frequency of all Pipelines" {
  :get sum of deployment frequency for each pipeline;
  :get pipeline count;
  if (pipelineCount is 0) then (yes)
    :set average deployment frequency to 0;
  else (no)
    :calculate average deployment frequency
    (sum of deployment frequency / pipeline count);
  endif
  :output AvgDeploymentFrequency/
}
:output DeploymentFrequency/
stop
@enduml
```

## Calculate Mean Time To Recovery

```plantuml
@startuml mean time to recovery
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Calculate mean time to recovery
start
:input deployTimes/
partition "Calculate Mean Time To Recovery of Pipelines" {
  :iterate over deployTimes;
  :initialize meanTimeRecoveryPipelineList;
    if (failed deployInfos of deployTime is not empty) then (yes)
      partition "Get Total Recovery Time And Recovery Times" {
        :sort all passed and failed deployInfos by pipelineCreateTime;
        :initialize totalTimeToRecovery, failedJobCreateTime, and recoveryTimes to 0;
        :iterate over sorted deployInfos;
          if (deployInfo state is passed and failedJobCreateTime is not 0) then (yes)
            :calculate total recovery time
            ( totalTimeToRecovery += deployInfo.pipelineCreateTime - failedJobCreateTime );
            :reset failedJobCreateTime to 0;
            :increase recovery times (+1) ;
          endif
          if (deployInfo state is failed and failedJobCreateTime is 0) then (yes)
            :set failedJobCreateTime to the deployInfo’s pipelineCreateTime;
          endif
        :return totalTimeToRecovery and recoveryTimes;
      }
      :calculate timeToRecovery
      (totalTimeToRecovery / recoveryTimes);
    else (no)
      :set timeToRecovery to 0;
    endif
  :create MeanTimeToRecoveryOfPipeline with pipelineName, pipelineStep, timeToRecovery;
  :put MeanTimeToRecoveryOfPipeline to meanTimeRecoveryPipelineList;
  :output List<MeanTimeToRecoveryOfPipeline> /
}
partition "Calculate Average Mean Time To Recovery" {
  :get sum of timeToRecovery of each pipeline;
  :get pipelines count;
  if (pipelineCount is 0) then (yes)
    :set avgMeanTimeToRecovery to 0;
  else (no)
    :calculate avgMeanTimeToRecovery
    (sum of timeToRecovery / pipeline count);
  endif
  :create AvgMeanTimeToRecovery with avgMeanTimeToRecovery;
  :output AvgMeanTimeToRecovery/
}
:output MeanTimeToRecovery with meanTimeRecoveryPipelineList and avgMeanTimeToRecovery/
stop
@enduml
```

## Calculate Change Failure Rate

```plantuml
@startuml Change Failure Rate
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Calculate Change Failure Rate
start
:input deployTimes/
partition "Calculate Change Failure Rate of Pipelines" {
  :iterate over DeployTimes;
  :initialize ChangeFailureRateOfPipelineList;
  :initialize totalFailedTimes, totalTimes: to 0;
  :get the number of failed deployInfos for each selected step;
  :get the number of passed deployInfos for each selected step;
  :calculate total number of deployInfos of each step
  (totalTimesOfPipeline = failedTimesOfPipeline + passedTimesOfPipeline);
  :calculate failureRate of each step
  (failureRate = failedTimesOfPipeline/totalTimesOfPipeline);
  :calculate total number of failed deployInfos of all step
  (totalFailedTimes += failedTimesOfPipeline);
  :calculate total number of all deployInfos of all step
  (totalTimes += totalTimesOfPipeline);
  :create ChangeFailureRateOfPipeline object with
  pipelineName, pipelineStep,failedTimesOfPipeline, totalTimesOfPipeline,failureRate;
  :put ChangeFailureRateOfPipeline in ChangeFailureRateOfPipelineList;
  :output List<ChangeFailureRateOfPipeline> /
}
partition "Calculate Average Change Failure Rate" {
  :create AvgChangeFailureRate object;
  :calculate average failureRate
  (averageFailureRate = totalFailedTimes/totalTimes);
  :set name,totalFailedTimes, totalTimes, averageFailureRate;
  :output AvgChangeFailureRate/
}
:output ChangeFailureRate/

stop

@enduml
```

## Calculate LeadTime for Changes

```plantuml
@startuml LeadTime for Changes
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - LeadTime for Changes
start
:Input: startTime, endTime
pipeline token, database token;
:Get deployTimes from pipeline serives;
:Filter deployTimes of Passed;
  repeat: DeployTime of Passed
    :Get PullRequst info with the repositoy in DeployTime from service;
      :Get Commit info by pullrequest from service;
      :Filter the first commit info;
      :Get firstCommitTimeInPr, prmergeTime, jobFinishTime;
    backward: repeat for per passed deployTime;
    repeat while (Ready to calclulate LeadTime)
    :
      LeadTime of per pipeline deploy:

      * mergeDelayTime = prMergedTime - firstCommitTimeInPr
      * pipelineDelayTime = jobFinishTime - prMergedTime
      * totalDelayTine = mergeDelayTime + pipelineDelayTime
      ;
  ->sum;
  : Calclulate average LeadTime of all pipeline;

  :
  Average LeadTime of total pipeline deploy:
     *AverageLeadMergeDelayTime = totalMergeDelayTime / pipelineCount
     * AveragePipelineDelayTime = totalPipelineDelayTime/pipelineCount`
     * AverageTotalDelayTime = AverageLeadMergeDelayTime + AveragePipelineDelayTime;
     : OutPut:
     LeadTimeForChanges;
stop
@enduml
```

## Export Pipeline CSV

### Old app: Generate Pipeline CSV For LeadTime

```plantuml
@startuml Generate Pipeline CSV For LeadTime
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate Pipeline CSV For LeadTime
start
:input request.codebaseSetting,BuildInfosOfLeadTimes,pipelineLeadTimeList/
  :initialize leadTimeCsvDataList:PipelineCsvInfo[]=[];
  if (codebaseSetting==undefined) then (yes)
    :return [];
  endif
  :get codebase instance by codebaseSetting.type, codebaseSetting.token;
  partition "Generate List<leadTimeCsvData>"{
  :iterate over leadTimeEnv of codebaseSetting.leadTimeEnvList;
    :get repoId by leadTimeEnv.id;
    :get buildInfos by leadTimeEnv.id;
    partition "Generate leadTimeCsvData "{
      partition "filter buildInfos "{
        :convert buildInfo where name is step.name and buildInfo.state is passed/failed to deployInfo;
        if(check if the commitId in deployInfo is not empty) then (yes)
          :return buildInfos;
        endif
      }
      :iterate over buildInfos;
        :convert buildInfo where name is step.name and buildInfo.state is passed/failed to deployInfo;
        :output buildInfo, deployInfo/
        :get commitInfo through deployInfo.commitId and repoId;
        :output commitInfo /
        partition "Generate leadTimeInfos from pipelineLeadTimeList"{
          :filter pipelineLeadTimeList with pipelineName equals to leadTimeEnv.name;
          if(filtered pipelineLeadTimeList not empty) then (yes)
            if(filter leadTime in pipelineLeadTime with commitId equals to deployInfo.commitId) then (yes)
            :return leadTimes;
            endif
          endif
          :output leadTimeInfo/
        }
        :create new PipelineCsvInfo(leadTimeCsvData);
          :set leadTimeCsvData with leadTimeEnv.name,leadTimeEnv.step,
            buildInfo,deployInfo,commitInfo and new LeadTimeInfo(leadTimeInfo);
      :output leadTimeCsvData/
    }
    :add leadTimeCsvData to leadTimeCsvDataList;
  }
:output List<PipelineCsvInfo> leadTimeCsvDataList /
stop
@enduml
```

### Old app: Generate Pipeline CSV For BuildInfos

```plantuml
@startuml Generate Pipeline CSV For BuildInfos
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate Pipeline CSV For BuildInfos
start
:input request.buildKiteSetting.deploymentEnvList/
  :initialize deploymentCsvDataList:PipelineCsvInfo[]=[];
  partition "Generate deploymentCsvDataList"{
  :iterate over deploymentEnv of deploymentEnvList;
    :get buildInfos by deploymentEnv.id;
    partition "Generate deploymentCsvData "{
      partition "filter buildInfos "{
        :convert buildInfo where name is step.name and buildInfo.state is passed/failed to deployInfo;
        if(check if the commitId in deployInfo is not empty) then (yes)
          :return buildInfos;
        endif
      }
      :iterate over buildInfos;
        :convert buildInfo where name is step.name and buildInfo.state is passed/failed to deployInfo;
        :output buildInfo, deployInfo/
        :get jobFinishTime through deployInfo.jobFinishTime;
        :get pipelineStartTime through deployInfo.pipelineCreateTime;
        partition "Generate noMergeDelayTime"{
          :input deployInfo.commitId, jobFinishTime,pipelineStartTime/
          :set noMergeDelayTime = new LeadTime(deployInfo.commitId,jobFinishTime,pipelineStartTime);
          :output noMergeDelayTime/
        }
        :create new deploymentCsvInfo(deploymentCsvData);
          :set deploymentCsvData with deploymentEnv.name,deploymentEnv.step,
            buildInfo,deployInfo,new CommitInfo(),new LeadTimeInfo(noMergeDelayTime);
      :output deploymentCsvData/
    }
    :add deploymentCsvData to deploymentCsvDataList;
  }
:output List<PipelineCsvInfo> deploymentCsvDataList /
stop
@enduml
```

### Old app: Generate Pipeline CSV

```plantuml
@startuml Generate CSV For Pipeline
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate CSV For Pipeline
start
:input request.codebaseSetting,request.buildKiteSetting,request.csvTimeStamp/
if(check if the buildKiteSetting is undefined) then (yes)
:return;
endif
:generate leadTimeCsvDataList through [Generate Pipeline CSV For LeadTime];
:generate deploymentCsvDataList through [Generate Pipeline CSV For BuildInfos];
:concat leadTimeCsvDataList and deploymentCsvDataList to generate pipelineDataList;
:output pipelineDataList/
:convert pipelineDataList to a CSV;
:save the CSV on disk;
stop
@enduml
```

### New app: Generate Pipeline CSV For LeadTime

```plantuml
@startuml Generate Pipeline CSV For LeadTime
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate Pipeline CSV For LeadTime
start
:input request.codebaseSetting,leadTimeBuildInfosList,pipelineLeadTimeList,startTime,endTime/
  :initialize pipelineCsvInfos:PipelineCsvInfo[]=[];
  if (codebaseSetting==null) then (yes)
    :return [];
  endif
  partition "Generate List<PipelineCsvInfo>"{
  :iterate over leadTimeEnv of codebaseSetting.leadTimeEnvList;
    :get repoId by leadTimeEnv.id;
    :get buildInfos by leadTimeEnv.id;
    partition "Generate pipelineCSVData "{
      partition "filter buildInfos "{
        :get buildKiteJob where name is step.name, state is passed/failed, finishedAt >= startTime and <= endTime for each buildInfo;
        if(check if the commitId and buildKiteJob of buildInfo is not empty) then (yes)
          :return buildInfos;
        endif
      }
      :iterate over buildInfos;
        :convert buildInfo where name is step.name and buildInfo.state is passed/failed to deployInfo;
        :output buildInfo, deployInfo/
        partition "Generate leadTimeInfos from pipelineLeadTimeList"{
          :filter pipelineLeadTimeList with pipelineName equals to leadTimeEnv.name;
          if(filtered pipelineLeadTimeList not empty) then (yes)
            if(filter leadTime in pipelineLeadTime with commitId equals to deployInfo.commitId) then (yes)
            :return leadTimes;
            endif
          endif
          :output leadTimeInfo/
        }
        :get commitInfo by deployInfo.commitId,repoId and github token;
        :output commitInfo /
        :create new PipelineCsvInfo with leadTimeEnv.name,leadTimeEnv.step,
          buildInfo,deployInfo,commitInfo and new LeadTimeInfo(leadTimeInfo);
      :output pipelineCSVData/
    }
    :add pipelineCSVData to pipelineCsvInfos;
  }
:output List<PipelineCsvInfo> pipelineCsvInfos /
stop
@enduml
```

### New app: Generate Pipeline CSV For BuildInfos

```plantuml
@startuml Generate Pipeline CSV For BuildInfos
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate Pipeline CSV For BuildInfos
start
:input request.buildKiteSetting.deploymentEnvList, buildInfosList,startTime,endTime /
  :initialize pipelineCsvInfos:PipelineCsvInfo[]=[];
  partition "Generate List<PipelineCsvInfo>"{
  :iterate over deploymentEnv of deploymentEnvList;
    :get buildInfos by deploymentEnv.id;
    partition "Generate pipelineCSVData "{
      partition "filter buildInfos "{
      :get buildKiteJob where name is step.name, state is passed/failed, finishedAt >= startTime and <= endTime for each buildInfo;
        if(check if the commitId and buildKiteJob of buildInfo is not empty) then (yes)
          :return buildInfos;
        endif
      }
      :iterate over buildInfos;
        :convert buildInfo where name is step.name and buildInfo.state is passed/failed to deployInfo;
        :output buildInfo, deployInfo/
        :get LeadTime without MergeDelayTime;
        :create new PipelineCsvInfo with leadTimeEnv.name,leadTimeEnv.step,
          buildInfo,deployInfo,new CommitInfo(),new LeadTimeInfo(LeadTimeWithoutMergeDelayTime);
      :output pipelineCSVData/
    }
    :add pipelineCSVData to pipelineCsvInfos;
  }
:output List<PipelineCsvInfo> pipelineCsvInfos /
stop
@enduml
```

### New app: Generate Pipeline CSV

```plantuml
@startuml Generate CSV For Pipeline
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate CSV For Pipeline
start
:input request.codebaseSetting,request.buildKiteSetting,request.csvTimeStamp/
if(check if the buildKiteSetting is undefined) then (yes)
:return;
endif
:generate leadTimeData through [Generate Pipeline CSV For LeadTime];
:generate pipelineData through [Generate Pipeline CSV For BuildInfos];
:concat leadTimeData and pipelineData to generate pipelineDataList;
:output pipelineDataList/
:convert pipelineDataList to a CSV;
:save the CSV on disk;
stop
@enduml
```

### Generate Board CSV

```plantuml
@startuml Generate CSV For Board
skin rose
skinparam defaultTextAlignment center
title FlowChart - Heartbeat - Generate CSV For Board
start
:input allDoneCards, nonDoneCards, jiraColumns, request.jiraBoardSetting.targetFields,request.csvTimeStamp/
:get activeTargetFields use field.flag filter targetFields;
partition "Get ExtraFields"{
 :input CSVField and targetFields/
 if(check if the targetField is not in CSVField) then (add targetField to extraFields)
 :return;
 endif
 :output extraFields/
}
partition " Sort jiraNonDoneCardResponses array base on jiraColumns"{
if (status undefined in columns) then (invalid status)
  :Return jiraColumns.length + 1;
else (valid status)
  :Calculate index for status a;
  :Calculate index for status b;
  :Compare the indices;
endif
}
:get allCardList through [concat allDoneCards and nonDoneCards];
:output allCardList/
:update ExtraFields [update the data in the allCardList array based on each field.originKey in extraFields];
:insert ExtraFields [expand the table and insert extraFields into fields];
:extract all non duplicate column values from the allCardList array;
:add each column value to the fields array as a new field object;
partition "Get CardsInfoList"{
 :iterate over card of allCardList;
 :update CSVField with CycleTime Columns;
 :build CycleTimeFlat Object use CycleTime;
 :calculate: TotalCycleTime / StoryPoints;
 :output cardsInfoList/
}
:convert cardsInfoList to a CSV;
:save the CSV on disk;
stop
@enduml
```
