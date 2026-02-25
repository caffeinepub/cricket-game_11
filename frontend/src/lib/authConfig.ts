/**
 * Authentication configuration module.
 * Provides environment-aware Internet Identity provider URL.
 */

/**
 * Returns the correct Internet Identity provider URL based on the current environment.
 * - Local development: uses the local replica's identity canister
 * - Production ICP: uses the mainnet identity.ic0.app
 */
export function getIdentityProviderUrl(): string {
  const hostname = window.location.hostname;

  // Check if we're running locally
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost');

  if (isLocal) {
    // Local development: use local Internet Identity canister
    return `http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`;
  }

  // Production ICP deployment — always use mainnet identity
  const providerUrl = 'https://identity.ic0.app';
  console.info('[authConfig] Identity provider URL:', providerUrl, '| hostname:', hostname);
  return providerUrl;
}

/**
 * Returns true if the app is running in a local development environment.
 */
export function isLocalEnvironment(): boolean {
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  );
}
