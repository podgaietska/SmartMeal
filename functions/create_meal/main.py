# add your create-meal function here
import datetime
import uuid
import boto3
import json
import requests

# Create the clients
ssm = boto3.client("ssm", "ca-central-1")

# Create the resource of dynamodb
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("smart_meals_table")

def get_openai_api_key():
    """
    Get the OpenAI API Key from SSM.
    
    :return: API Key as a string
    """
    try:
        response = ssm.get_parameter(Name='OpenAI_API_Key', WithDecryption=True)
        print("openai key in get_openai_key:", response['Parameter']['Value'])
        return response['Parameter']['Value']
    except Exception as e:
        print(e)
        return None
        
        
def create_recipe_with_chatgpt(prompt, openai_api_key):
    """
    Create a meal recipe with OpenAI's GPT-3 API

    :param prompt: The prompt
    :return: The recipe
    """

    try:
        # Set the url, headers and body
        url = f"https://api.openai.com/v1/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}"
        }
        body = {
            "model": "gpt-3.5-turbo-instruct",
            "prompt": prompt,
            "max_tokens": 600,
            "temperature": 0.4,
        }

        # Http post request to OpenAI's GPT-3 API
        response = requests.post(url, headers=headers, json=body)
        data = response.json()

        # Return the recipe text
        if 'error' in data:
            raise Exception(f"OpenAI Error: {data['error']['message']}")
        return data['choices'][0]['text']

    except Exception as e:
        raise Exception(f"Error creating recipe with OpenAI: {str(e)}")


def put_item_to_dynamodb(item):
    """
    Put an item to DynamoDB

    :param item: The item
    :return: The response
    """

    try:
        # Put an item to DynamoDB
        res = table.put_item(Item=item)

        # Return the response
        return res

    except Exception as e:
        # Print the error
        print(e)

        # Return the error
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "Error": str(e)
            })
        }
        
def auth_info(access_token):
    try:
        url = f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
        response = requests.get(url)
        user_info = response.json()
        return user_info
    except Exception as error:
        print(f"An error occurred: {error}")
        return None


def lambda_handler(event, context):
    access_token = event["headers"]["access-token"]
    email = event["queryStringParameters"]["email"]
    
    if not access_token or not email:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"error": "Bad request parameters"})
        }
    
    try:
        user_info = auth_info(access_token)
        if user_info and user_info['email'] == email:
            
            data = json.loads(event["body"])
            ingredients_list = ', '.join(data["ingredients"])

            openai_api_key = get_openai_api_key()
            if not openai_api_key:
                raise Exception("Failed to retrieve OpenAI API Key from SSM.")

            # Create the prompt
            prompt = (f"Based on the ingredients: [{ingredients_list}], suggest a {data['mealType']} meal recipe."
                        "Desired format:\n<recipe_name>\n\n"
                        "- <ingredient_1>\n- <ingredient_2>\n- ...\n\n"
                        "1. <step_1>\n2. <step_2>\n3. <step_3>\n4. <step_4>\n5. <step_5>")
            # Create the meal recipe with OpenAI's GPT-3 API
            meal_recipe = create_recipe_with_chatgpt(prompt, openai_api_key)

            # Generate a random id
            meal_id = str(uuid.uuid4())
            timestamp = str(datetime.datetime.now())

            # Create item for DynamoDB
            item = {
                "email": email,
                "id": meal_id,
                "meal_type": data["mealType"],
                "meal_recipe": meal_recipe,
                "created_at": timestamp,        
            }

            # Put the item to DynamoDB
            _ = put_item_to_dynamodb(item)

            # Return a status code 200 if everything is OK
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps(item)
            }

    except Exception as e:
        # Print the error in CloudWatch
        print(e)

        # Return an status code 500 if there is an error
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "error": str(e)
            })
        }