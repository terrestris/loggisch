## loggisch

Tiny JS logging library for backend (NodeJS, bun) and frontend (ES6/UMD).

## Installation & usage

```sh
bun add loggisch
```
or

```sh
npm i loggisch
```

In your code:
```ts
import { logger, setLogLevel } from 'loggisch';

setLogLevel('error');

logger.error('Will be logged');

logger.warn('Will not be logged');
```

## API

Check out the main.ts

## Development

For development bun is recommended:

### Tests (requires bun):
```sh
bun test
```

### Building
```sh
bun run build
```
or
```sh
npm run build
```
