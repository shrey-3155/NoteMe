import json
import boto3

BUCKET_NAME = 'serverless-activity-1'
s3_client = boto3.client('s3')
dynamodb_resource = boto3.resource('dynamodb')
notes_table = dynamodb_resource.Table('serverless-activity-1')

def lambda_handler(event, context):
    try:
        # Retrieve all notes from the DynamoDB table
        response = notes_table.scan()
        note_items = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'success', 'notes': note_items})
        }
    except Exception as error:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'Failed to list notes', 'error': str(error)})
        }
