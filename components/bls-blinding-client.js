import { randomBytes } from "crypto";
import thresholdBls from "blind-threshold-bls";

export default class WebBlsBlindingClient {
  constructor(odisPubKey) {
    this.odisPubKey = Buffer.from(odisPubKey, "base64");
  }

  async init() {
    await thresholdBls.init("/blind_threshold_bls_bg.wasm");
  }

  async blindMessage(base64PhoneNumber, seed) {
    const userSeed = seed ?? randomBytes(32);
    if (!seed) {
      console.warn(
        "Warning: Use a private deterministic seed (e.g. DEK private key) to preserve user quota when requests are replayed."
      );
    }
    this.rawMessage = Buffer.from(base64PhoneNumber, "base64");
    this.blindedValue = await thresholdBls.blind(this.rawMessage, userSeed);
    const blindedMessage = this.blindedValue.message;
    return Buffer.from(blindedMessage).toString("base64");
  }

  async unblindAndVerifyMessage(base64BlindSig) {
    if (!this.rawMessage || !this.blindedValue) {
      throw new Error("Must call blind before unblinding");
    }

    const blindedSignature = Buffer.from(base64BlindSig, "base64");
    const unblindMessage = await thresholdBls.unblind(
      blindedSignature,
      this.blindedValue.blindingFactor
    );
    // this throws on error
    await thresholdBls.verify(this.odisPubKey, this.rawMessage, unblindMessage);
    return Buffer.from(unblindMessage).toString("base64");
  }

  isReactNativeEnvironment() {
    return (
      typeof navigator !== "undefined" && navigator.product === "ReactNative"
    );
  }
}
