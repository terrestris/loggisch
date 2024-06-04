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
import log from 'loggisch';

log.setLogLevel('error');

log.error('Will be logged');

log.warn('Will not be logged');
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
