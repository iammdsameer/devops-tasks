# DevOps Tasks

### Pre-requisites

Before proceeding, ensure you have the following tools installed and configured:

- **AWS CLI:** Version 2.22.26 or higher
- **Node.js:** Version 22.12.0 or higher
- **TypeScript:** Version 5.7.2
- **AWS CDK:** Version 2.173.4

### Installing Required Versions

To install the correct versions of TypeScript and AWS CDK, execute the following command:

```bash
npm i -g typescript@5.7.2 aws-cdk@2.173.4
```

### AWS Credentials

Configure your AWS credentials as environment variables:

- `AWS_ACCESS_KEY_ID`  
  _Example: `export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE` (This is just an example, use your actual access key)_
- `AWS_DEFAULT_REGION`  
  _Example: `export AWS_DEFAULT_REGION=us-east-1` (Choose your desired AWS region)_
- `AWS_SECRET_ACCESS_KEY`  
  _Example: `export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` (Use your actual secret access key)_
- `CDK_DEFAULT_ACCOUNT`  
  _Example: `export CDK_DEFAULT_ACCOUNT=123456789012` (Use your 12-digit AWS account ID)_

**Important:** Ensure these credentials have the necessary permissions to create and manage AWS resources. These environment variables need to be set in your shell before running AWS CLI or CDK commands. You can also set these variables in `.bashrc`, `.zshrc` or equivalent files.

### Verify Authentication

Verify your AWS credentials with the following command:

```bash
aws sts get-caller-identity
```

## Task 1: Deploying the EKS Cluster and S3 Bucket

This task involves deploying the core infrastructure using AWS CDK.

1.  **Navigate to the CDK directory:**

    ```bash
    cd eks-s3
    ```

2.  **Bootstrap CDK to your AWS Account:**

    ```bash
    cdk bootstrap
    ```

3.  **Deploy the CDK Application:**

    ```bash
    cdk deploy
    ```

4.  **Accessing the EKS Cluster:** After the successful deployment, the CDK output will include a `EksS3Stack.KubeCommand`. Copy and paste this command into your terminal to configure your `kubectl` tool and manage the EKS cluster.

## Task 2: Deploying Nginx Application

This task deploys an Nginx server using Helm and exposes it to the internet. _This task depends on successful completion of Task 1_. Before proceeding, make sure you are at the root directory.

1.  **Install Nginx using Helm Chart:**

    ```bash
    helm install nginx-release ./nginx-chart;
    ```

2.  **Retrieve the Service IP:**

    ```bash
    export SERVICE_IP=$(kubectl get svc --namespace default nginx-nginx-chart --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
    echo http://$SERVICE_IP:80
    ```

    This command will output the public IP address of your Nginx service.

3.  **Access the Frontend:** Click on the generated link `http://$SERVICE_IP:80` in your browser to view the application frontend. Please note that DNS propagation may take some time, so the frontend might not be immediately accessible.

## Task 3: CI/CD with GitHub Actions

This task sets up a GitHub Actions workflow for automatic deployments whenever changes are pushed to the main branch.

1.  **GitHub Secrets Configuration:**

    Make sure you have an ECR repo called `task-3-building-ci-cd` created. Also ensure that the following AWS credential environment variables are set as secrets in your GitHub repository:

    - `AWS_ACCESS_KEY_ID`
    - `AWS_DEFAULT_REGION`
    - `AWS_SECRET_ACCESS_KEY`

2.  **Triggering the Workflow:**

    - **Push to Main Branch:** Make a change to the `index.html` file and commit it to the main branch. This will trigger the GitHub Actions workflow automatically.
    - **Manual Trigger via GitHub UI:** You can also manually trigger the workflow from the Actions tab in your GitHub repository.
