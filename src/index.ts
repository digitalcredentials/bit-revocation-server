import { build } from './app';

const server = build({
  logger: true
});

const PORT: any = process.env.PORT || 5000;

server.listen(PORT, '::', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
