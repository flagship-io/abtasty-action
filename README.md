# GitHub Action - AB Tasty action

| :exclamation: We only support Feature Experimentation (For now) |
| --------------------------------------------------------------- |

This repository contains a custom GitHub Action designed to create and manage
your AB Tasty resources for feature experimentation and web experimentation
products such as projects, campaigns, teams, etc... You can use these commands
to perform common AB Tasty platform actions from your terminal or through
scripts and other automation.

Our Github Action is built on top of our CLI, enabling you to use resource
loader to batch your processes.

For example, you can use the AB Tasty Action to manage :

Feature experimentation: Projects, campaigns, flags, targeting keys, goals,
etc...

## Features

- Feature Experimentation:
  - [Login & authenticate](https://docs.developers.flagship.io/docs/feature-experimentation-authentication#/)
  - List resources: project, campaign, variation group, variation, targeting
    key, goal
  - [Load resource](https://docs.developers.flagship.io/docs/feature-experimentation-resource#/)

## Usage

### Prerequisites

Make sure you have the following set up before using this action:

- A GitHub repository
- Necessary permissions or secrets added to your repository

### Basic Example

Add the following to your workflow YAML file (e.g.,
`.github/workflows/your-workflow.yml`):

```yaml
name: Load resource to Feature experimentation workflow

on:
  push:
    branches:
      - main

jobs:
  load-resources:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Your Action
        uses: flagship-io/abtasty-action@v0.2
        with:
          fe-login-auth: |
            commandId: c1
            username: configuration-name
            client-id: ${{secrets.CLIENT_ID}}
            client-secret: ${{secrets.CLIENT_SECRET}}
            account-id: ${{secrets.ACCOUNT_ID}}
            account-environment-id: ${{secrets.ACCOUNT_ENVIRONMENT_ID}}

          fe-load-resource: |
            commandId: c2
            file: resource-loader-templates/file-example.json
            input-params-file: resource-loader-templates/input-params-file-example.json
            output-format: json
```

### Inputs

| Input Name          | Required | Default Value | Description                                                                                                                           |
| ------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fe-login-auth`     | Yes      | `N/A`         | Feature experimentation: [Login & authenticate](https://docs.developers.flagship.io/docs/feature-experimentation-authentication#/)    |
| `fe-load-resource`  | No       | `N/A`         | Feature experimentation: [Load resources](https://docs.developers.flagship.io/docs/feature-experimentation-resource#/) from your file |
| `fe-list-flag`      | No       | `N/A`         | Feature experimentation: List flags                                                                                                   |
| `fe-list-campaign`  | No       | `N/A`         | Feature experimentation: List campaigns                                                                                               |
| `fe-list-project`   | No       | `N/A`         | Feature experimentation: List projects                                                                                                |
| `fe-list-goal:`     | No       | `N/A`         | Feature experimentation: List goals                                                                                                   |
| `fe-list-tk`        | No       | `N/A`         | Feature experimentation: List targeting keys                                                                                          |
| `fe-list-vg`        | No       | `N/A`         | Feature experimentation: List variation groups                                                                                        |
| `fe-list-variation` | No       | `N/A`         | Feature experimentation: List variations                                                                                              |

### Outputs

| Output Name      | Description        |
| ---------------- | ------------------ |
| `commandsResult` | Result of CLI flow |

---

## Secrets

If your action requires secrets, add them to your repository under **Settings >
Secrets and variables > Actions**.

| Secret Name              | Description            |
| ------------------------ | ---------------------- |
| `CLIENT_ID`              | Client ID              |
| `CLIENT_SECRET`          | Client Secret          |
| `ACCOUNT_ID`             | Account ID             |
| `ACCOUNT_ENVIRONMENT_ID` | Account environment ID |

---

## Example Scenarios

### Example 1: List project

```yaml
steps:
  - name: List Project
    uses: flagship-io/abtasty-action@v0.2
    with:
      fe-login-auth: |
        commandId: c1
        username: configuration-name
        client-id: ${{secrets.CLIENT_ID}}
        client-secret: ${{secrets.CLIENT_SECRET}}
        account-id: ${{secrets.ACCOUNT_ID}}
        account-environment-id: ${{secrets.ACCOUNT_ENVIRONMENT_ID}}

      fe-list-project: |
        commandId: c2
```

### Example 2: Load resources

```yaml
steps:
  - name: Load resources
    uses: flagship-io/abtasty-action@v0.2
    with:
      fe-login-auth: |
        commandId: c1
        username: configuration-name
        client-id: ${{secrets.CLIENT_ID}}
        client-secret: ${{secrets.CLIENT_SECRET}}
        account-id: ${{secrets.ACCOUNT_ID}}
        account-environment-id: ${{secrets.ACCOUNT_ENVIRONMENT_ID}}

      fe-load-resource: |
        commandId: c2
        file: resource-loader-templates/file-example.json
        input-params-file: resource-loader-templates/input-params-file-example.json
        output-format: json
```

---

## Development

### Testing Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/flagship-io/abtasty-action.git
   ```
2. Make your changes and commit them.
3. Test the action locally using [act](https://github.com/nektos/act) or a
   similar tool.

### Building the Action

If your action uses a compiled language or requires packaging:

```bash
npm install && npm run build
```

If you set up [act](https://github.com/nektos/act):

```bash
make act
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [AB Tasty CLI](https://docs.developers.flagship.io/docs/abtasty-command-line-interface#/)
- [Create custom action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action)

---

For questions or support, open an issue or contact flagship@abtasty.com.
