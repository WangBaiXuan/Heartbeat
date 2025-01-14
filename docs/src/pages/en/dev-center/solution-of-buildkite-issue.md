---
title: Solution of BuildKite issue
description: Solution of BuildKite issue
layout: ../../../layouts/MainLayout.astro
---

## ExpiredTokenException

**Issue**

```
An error occurred (ExpiredTokenException) when calling the GetAuthorizationToken operation: The security token included in the request is expired
Error: Cannot perform an interactive login from a non TTY device
```

**Solution**

- Login AWS and Select Singapore region.
- Connect to `HeartbeatBuildKiteAgent` EC2 environment.
- Execute the command `sudo vim /etc/buildkite-agent/hooks/environment`
- Change this part with current cmd line env

  ```yaml
  export AWS_ACCESS_KEY_ID="x...x"
  export AWS_SECRET_ACCESS_KEY="x...x"
  export AWS_SESSION_TOKEN="x...x"
  ```

## Docker permission denied

**Issue**

```
Start to perform cleanup
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get
"http://%2Fvar%2Frun%2Fdocker.sock/v1.24/system/df": dial unix /var/run/docker.sock: connect: permission denied
```

**Solution**

- Login AWS and Select Singapore region.
- Connect to `HeartbeatBuildKiteAgent` EC2 environment.
- Execute the command `sudo chmod 666 /var/run/docker.sock`
