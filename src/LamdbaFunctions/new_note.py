import json
import boto3
import uuid
from datetime import datetime

# Define the S3 bucket and DynamoDB table names
BUCKET_NAME = 'serverless-activity-1'
s3_client = boto3.client('s3')
dynamodb_resource = boto3.resource('dynamodb')
notes_table = dynamodb_resource.Table('serverless-activity-1')

def lambda_handler(event, context):
    try:
        # Generate a unique identifier for the note and create a corresponding file name
        note_identifier = uuid.uuid4().hex
        document_name = f"{note_identifier}.txt"
        
        # Parse the request body for note content
        note_content = event.get('text')
        
        # Upload the note content to S3
        s3_client.put_object(Bucket=BUCKET_NAME, Key=document_name, Body=note_content)
        
        # Add metadata of the note to DynamoDB
        notes_table.put_item(Item={
            'noteIdentifier': note_identifier,
            'documentName': document_name,
            'createdAt': datetime.now().isoformat()
        })
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'success', 'noteIdentifier': note_identifier})
        }
    except Exception as error:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'Failed to create note', 'error': str(error)})
        }