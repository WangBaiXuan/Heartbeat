---
title: Error handle
description: Error handle
layout: ../../../layouts/MainLayout.astro
---

## FeignClient

**Use decoder to handle FeignClient exception.**

### Common

- **401**: Token is incorrect
- **404**: 404 Not Found
- **503**: Service Unavailable
- **5xx**: Server Error
- **4xx**: Client Error

### GitHub

- **403**: GitHub api rate limit

## Config Page

### Board

- **204**: Sorry there is no card has been done, please change your collection date!
- **400**: Jira verify failed: Please reconfirm the input
- **401**: Jira verify failed: Token is incorrect
- **404**: Jira verify failed: 404 Not Found
- **503**: Jira verify failed: Service Unavailable

### Pipeline Tool

- **401**: BuildKite verify failed: Token is incorrect
- **403**: BuildKite verify failed: Permission denied
- **404**: BuildKite verify failed: 404 Not Found
- **503**: BuildKite verify failed: Service Unavailable

### Source Control

- **401**: GitHub verify failed: Token is incorrect
- **404**: BuildKite verify failed: 404 Not Found
- **503**: BuildKite verify failed: Service Unavailable

## Metrics Page

### Get steps

- **204**: There is no step during this period for this pipeline! Please change the search time in the Config page! (
  empty step)

## Report Page

### Generate report

- **500**: Internal Server Error
- **403**: GitHub verify failed: GitHub api rate limit

### Export report

- **500**: failed to export csv: Internal Server Error

## Error format

### Now

Class: `RestApiErrorResponse`

Structure:

```json
{
  "status": 500,
  "errorMessage": "XXX",
  "hintInfo": "XXX"
}
```

### Before

```json
{
  "message": "Request failed with status statusCode 401, error: Client Error"
}
```

```json
{
  "timestamp": "2023-06-09T06:47:39.443+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/v1/reports"
}
```

```json
{
  "message": "Request failed with status code 401, error: [401 Unauthorized] during [GET] to [https://api.github.com/user/repos] [GitHubFeignClient#getAllRepos(String)]: [{\"message\":\"Bad credentials\",\"documentation_url\":\"https://docs.github.com/rest\"}]"
}
```
