terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

locals {
    db_name                 = "smart_meals_table"
    get_meals_dir           = "../functions/get_meals"
    create_meal_dir         = "../functions/create_meal"
    artifact_name           = "artifact.zip"
    get_function_name       = "get_meals"
    create_function_name    = "create_meal"
    handler_name            = "main.lambda_handler"
}

resource "aws_dynamodb_table" "smart_meals_table"{
    name = local.db_name
    billing_mode = "PROVISIONED"

    read_capacity = 1
    write_capacity = 1

    hash_key = "email"
    range_key = "id"

    attribute {
        name = "email"
        type = "S"
    }
    attribute {
        name = "id"
        type = "S"
    }
}

resource "aws_iam_role" "lambda_role" {
  name               = "iam-role-for-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "policy-for-lambda"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:Scan",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.smart_meals_table.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "ssm_read_only" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

data "archive_file" "get_meals" {
    type = "zip"
    source_dir = local.get_meals_dir
    output_path = "${local.get_meals_dir}/${local.artifact_name}"
}

data "archive_file" "create_meal" {
    type = "zip"
    source_dir = local.create_meal_dir
    output_path = "${local.create_meal_dir}/${local.artifact_name}"
}

resource "aws_lambda_function" "get_meals" {
    role             = aws_iam_role.lambda_role.arn
    function_name    = local.get_function_name
    handler          = local.handler_name
    filename         = "${local.get_meals_dir}/${local.artifact_name}"
    source_code_hash = data.archive_file.get_meals.output_base64sha256
    runtime          = "python3.9"
    timeout          = 20
}

resource "aws_lambda_function" "create_meal" {
    role             = aws_iam_role.lambda_role.arn
    function_name    = local.create_function_name
    handler          = local.handler_name
    filename         = "${local.create_meal_dir}/${local.artifact_name}"
    source_code_hash = data.archive_file.create_meal.output_base64sha256
    runtime          = "python3.9"
    timeout          = 20
}

resource "aws_lambda_function_url" "get_meals" {
    function_name = aws_lambda_function.get_meals.function_name
    authorization_type = "NONE"

    cors {
        allow_credentials = true
        allow_origins = ["*"]
        allow_methods = ["GET"]
        allow_headers = ["*"]
        expose_headers    = ["keep-alive", "date"]
    }
}

resource "aws_lambda_function_url" "create_meal" {
    function_name = aws_lambda_function.create_meal.function_name
    authorization_type = "NONE"

    cors {
        allow_credentials = true
        allow_origins = ["*"]
        allow_methods = ["POST"]
        allow_headers = ["*"]
        expose_headers    = ["keep-alive", "date"]
    }
}

output "dynamo_table_name" {
    value = aws_dynamodb_table.smart_meals_table.name
}

output "lambda_get_meals_url" {
    value = aws_lambda_function_url.get_meals.function_url
}

output "lambda_create_meal_table_url" {
    value = aws_lambda_function_url.create_meal.function_url
}