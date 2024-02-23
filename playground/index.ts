import { $fetch } from "../src/node";

interface ApiDefinition {
  "/api/v1": {
    default: {
      response: { message: string };
    };
  };
  "/api/v1/auth/register": {
    post: {
      response: { message: string };
      request: {
        body: {
          name: string;
          email: string;
          username: string;
          password: string;
        };
      };
    };
  };
  "/api/v1/users/search": {
    get: {
      response: { users: { username: string }[] };
      request: {
        query: {
          username: string;
        };
      };
    };
  };
  "/api/users/:username": {
    get: {
      response: { user: { username: string; name: string; isFriend: boolean } };
      request: {
        params: {
          username: string;
        };
      };
    };
    post: {
      response: { message: string };
      request: {
        params: {
          username: string;
        };
      };
    };
  };
}

async function main() {
  // const r = await $fetch<string>('http://google.com/404')
  const r = await $fetch<string>("http://httpstat.us/500");
  // const r = await $fetch<string>('http://httpstat/500')
  // eslint-disable-next-line no-console
  console.log(r);

  const fetch$ = $fetch.create<unknown, ApiDefinition>({});

  const { message } = await fetch$("/api/v1");
  console.log(message);

  const r1 = await fetch$("/api/users/:username", {
    method: "POST",
    params: { username: "anurag" },
  });

  console.log(r1.message);

  const r2 = await fetch$("/api/users/:username", {
    method: "get",
    params: { username: "anurag" },
  });

  console.log(r2.user);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
