import { Server, LocalFileStore } from "@fly/core"
import { BundleAppStore } from "./bundle_app_store"

console.log(process.argv)
const bundleDir = process.argv[process.argv.length - 1] || process.cwd()

console.log("starting fly bundle server at", bundleDir)

let port = 3000
if (process.env.PORT) {
  port = parseInt(process.env.PORT, 10)
}
const env = process.env.FLY_ENV || "production"

const appStore = new BundleAppStore({
  dir: bundleDir,
  env
})

const server = new Server({
  appStore,
  env,
  inspect: false,
  bridgeOptions: {
    fileStore: new LocalFileStore(bundleDir)
  }
})

server.listen(port)
