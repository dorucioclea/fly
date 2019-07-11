import { FlyCommand } from "../../base-command"
import { processResponse } from "../../api"
import * as sharedFlags from "../../flags"
import { flags as oclifFlags } from "@oclif/command"
import { inspect } from "util"

export default class SecretsUnset extends FlyCommand {
  public static description = "remove secrets from an app"

  static flags = {
    app: sharedFlags.app(),
    env: sharedFlags.env(),
    token: sharedFlags.apiToken()
  }

  static args = [{ name: "key", description: "name of the secret", required: true }]

  public async run() {
    const { args, flags } = this.parse(SecretsUnset)

    const appName = this.getAppName(flags)
    const client = this.gqlClient(flags)
    const key = args.key

    const resp = await client.mutate({
      query: MUTATION,
      variables: {
        input: {
          appId: appName,
          keys: [key]
        }
      }
    })

    console.log(inspect(resp, { showHidden: true, depth: 10, colors: true }))
  }
}

const MUTATION = `
  mutation($input: UnsetSecretsInput!) {
    unsetSecrets(input: $input) {
      deployment {
        id
        app {
          runtime
          status
          ipAddresses {
            nodes {
              address
            }
          }
        }
        status
        currentPhase
      }
    }
  }
`
