import { $fetch } from "../src/node";

async function main() {
  // const r = await $fetch<string>('http://google.com/404')
  const b = $fetch("/api/v1", {
    //  ^?
    method: "get",
  });
  const a = $fetch("/api/v1", {
    //  ^?
    method: "post",
    query: {
      limit: 0,
    },
    body: {
      text: "",
    },
    params: {
      id: "",
    },
  });

  // const res = await $fetch("/api/v1/me", { method: "get" });

  const r = await $fetch("/api/v1/me", { method: "GET" });

  const r = await $fetch<string>("http://httpstat.us/500");
  // const r = await $fetch<string>('http://httpstat/500')
  // eslint-disable-next-line no-console
  console.log(r);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
