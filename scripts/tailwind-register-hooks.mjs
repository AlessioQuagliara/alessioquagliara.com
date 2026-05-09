import moduleApi from "node:module";

const originalRegister = moduleApi.register;
let tailwindHookRegistered = false;

function getUrl(specifier) {
  if (specifier && typeof specifier.href === "string") {
    return specifier.href;
  }

  if (typeof specifier === "string") {
    return specifier;
  }

  return "";
}

function isTailwindEsmCacheLoader(specifier) {
  const url = getUrl(specifier);

  return (
    url.includes("@tailwindcss/node") &&
    url.endsWith("/dist/esm-cache.loader.mjs")
  );
}

function registerTailwindEsmCacheHook(loaderUrl) {
  if (typeof moduleApi.registerHooks !== "function") {
    return false;
  }

  if (tailwindHookRegistered) {
    return true;
  }

  moduleApi.registerHooks({
    resolve(specifier, context, nextResolve) {
      const result = nextResolve(specifier, context);

      if (
        result.url === loaderUrl ||
        moduleApi.isBuiltin(result.url) ||
        !context.parentURL
      ) {
        return result;
      }

      const id = new URL(context.parentURL).searchParams.get("id");
      if (id === null) {
        return result;
      }

      const url = new URL(result.url);
      url.searchParams.set("id", id);

      return { ...result, url: url.toString() };
    },
  });

  tailwindHookRegistered = true;
  return true;
}

moduleApi.register = function register(specifier, parentURL, options) {
  if (
    isTailwindEsmCacheLoader(specifier) &&
    registerTailwindEsmCacheHook(getUrl(specifier))
  ) {
    return;
  }

  return typeof originalRegister === "function"
    ? originalRegister.call(this, specifier, parentURL, options)
    : undefined;
};
