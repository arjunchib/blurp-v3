# Blurp

A discord framework for typescript

## Design

### Adapters

- RuntimeAdapter
  - BunAdapter
  - CloudflareAdapter
- NetworkingAdapter
  - WebhookAdapter
    - onInteraction(cb)
  - GatewayAdapter
    - onInteraction(cb)

### Services

- ModelService
  - generateModels(schema)
- SchemaService
  - updateDiscord(schema)
- OrchestratorService
  - start()
- DiscordRestService
  - bulkUpload(commands)
  - get()
- InteractionService
  - start(router)

## Procedure

1. schemaService.updateDiscord(schema)
2. modelService.generateModels(schema)
3. interactionService.start()

## Dependencies

- RuntimeAdapter
- NetworkingAdapter
  - RuntimeAdapter
- ModelService
  - RuntimeAdapter
- SchemaService
  - DiscordRestService
- OrchestratorService
  - everything
- DiscordRestService
- InteractionService
  - NetworkAdapter
