export { writeSketchToReaper, currentStatus, defaultTemplatePath, defaultLuaPath } from "./reaper.js";
export { buildPoppinProjectRpp } from "./rpp.js";
export { findReaperApp, statusLabel } from "./status.js";
export {
  writeSketchForGarageBand,
  findGarageBandApp,
  currentGarageBandStatus,
} from "./garageband.js";
export type { ReaperStatus } from "./status.js";
export type { BridgeWriteResult } from "./reaper.js";
export type { GarageBandStatus, GarageBandWriteResult } from "./garageband.js";
