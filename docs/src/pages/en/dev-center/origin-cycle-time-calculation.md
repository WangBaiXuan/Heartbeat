---
title: OriginCycleTime calculation
description: OriginCycleTime calculation
layout: ../../../layouts/MainLayout.astro
---

## OriginCycleTime implementation of export board data

- **Red line**: OriginCycleTime：FLAG
- **Purple line**: OriginCycleTime：BLOCK
- **Green line**: Block days when Set Consider the "Flag" as "Block" is False.
- **Red line + Purple line**: Block days when Set Consider the "Flag" as "Block" is True.

### Scenarios

| Number | Description                                                                            | Timeline diagram                                                          | OriginCycleTime：FLAG                     | OriginCycleTime: BLOCK                       |
| :----- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | ----------------------------------------- | -------------------------------------------- |
| 1      | Move to Block column after flag duration                                               | ![img.png](../../../../public/assets/block-after-flag.png)                | Time between `Add flag` and `Remove flag` | Time in block column                         |
| 2      | Move out Block column before flag duration                                             | ![img.png](../../../../public/assets/block-before-flag.png)               | Time between `Add flag` and `Remove flag` | Time in block column                         |
| 3      | Block column duration within flag duration                                             | ![img.png](../../../../public/assets/block-witnin-flag.png)               | Time between `Add flag` and `Remove flag` | 0                                            |
| 4      | Flag duration within Block duration                                                    | ![img.png](../../../../public/assets/flag-within-block.png)               | Time between `Add flag` and `Remove flag` | Time in block column - Flag duration         |
| 5      | Block duration partial cross flag duration and block start time before flag start time | ![img.png](../../../../public/assets/block-partial-cross-flag-before.png) | Time between `Add flag` and `Remove flag` | Time in block column - Partial Flag duration |
| 6      | Block duration partial cross flag duration and block end time after flag end time      | ![img.png](../../../../public/assets/block-partial-cross-flag-after.png)  | Time between `Add flag` and `Remove flag` | Time in block column - Partial Flag duration |
