import json
import boto3

BUCKET_NAME = 'serverless-activity-1'
s3_client = boto3.client('s3')
dynamodb_resource = boto3.resource('dynamodb')
notes_table = dynamodb_resource.Table('serverless-activity-1')

def lambda_handler(event, context):
    try:
        # Extract note identifier from the query string parameters
        note_identifier = event.get('noteIdentifier')
        
        # Fetch the note metadata from DynamoDB
        note_record = notes_table.get_item(Key={'noteIdentifier': note_identifier})
        document_name = note_record['Item'].get('documentName')
        
        # Read the content from the S3 bucket
        s3_response = s3_client.get_object(Bucket=BUCKET_NAME, Key=document_name)
        note_content = s3_response['Body'].read().decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'success', 'noteIdentifier': note_identifier, 'text': note_content})
        }
    except Exception as error:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'Failed to retrieve note', 'error': str(error)})
        }
