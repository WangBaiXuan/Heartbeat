---
title: Emoji flow
description: Emoji flow
layout: ../../../layouts/MainLayout.astro
---

**Save the emoji resource in local.**

- Download the emoji list from an open source project: [BuildKite Emoji](https://cdn.jsdelivr.net/gh/buildkite/emojis@main/img-buildkite-64.json), [Apple Emoji](https://cdn.jsdelivr.net/gh/buildkite/emojis@main/img-apple-64.json)
- Remove unnecessary fields of the emoji json and keep the useful fields: `name`, `image`, `aliases`
- Concat this two emoji list
- Transform to one cleaned emoji list as we need to take name and aliases into consideration
- Find the corresponding emoji according to the name from the cleaned emoji list
- A default emoji will be displayed if we can't find one

## Display emoji

```plantuml
@startuml Display emoji file
skin rose
title Heartbeat - Display emoji

actor User
participant Browser
participant Frontend
participant BuildKite as "BuildKite Server"

group Display emoji
  User -> Browser: Interact
  activate Browser
  Browser -> Frontend: Send request
  activate Frontend
  Frontend -> Frontend: Process emoji list

  group Process pipeline steps data(Array)
    Frontend -> Frontend: Parse pipeline step name
    Frontend -> Frontend: Find emoji URL(return default emoji URL if not found)
    Frontend -> BuildKite: Request emoji image
    activate BuildKite
    BuildKite --> Frontend: Return emoji image
    deactivate BuildKite
  end

  Frontend --> Browser: Return emoji image
  deactivate Frontend
  Browser --> User: Render
  deactivate Browser
end
@enduml
```
