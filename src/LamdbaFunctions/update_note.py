import json
import boto3

BUCKET_NAME = 'serverless-activity-1'
s3_client = boto3.client('s3')
dynamodb_resource = boto3.resource('dynamodb')
notes_table = dynamodb_resource.Table('serverless-activity-1')

def lambda_handler(event, context):
    try:
        # Parse the request body to retrieve the note identifier and new content
        note_identifier = event.get('noteIdentifier')
        new_content = event.get('text')

        # Get the existing record from DynamoDB to find the associated document name
        note_record = notes_table.get_item(Key={'noteIdentifier': note_identifier})
        document_name = note_record['Item'].get('documentName')

        # Update the content in the S3 bucket
        s3_client.put_object(Bucket=BUCKET_NAME, Key=document_name, Body=new_content)
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'success'})
        }
    except Exception as error:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            'body': json.dumps({'result': 'Failed to edit note', 'error': str(error)})
        }