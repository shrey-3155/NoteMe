import json
import boto3

BUCKET_NAME = 'serverless-activity-1'
s3_client = boto3.client('s3')
dynamodb_resource = boto3.resource('dynamodb')
notes_table = dynamodb_resource.Table('serverless-activity-1')

def lambda_handler(event, context):
    try:
        # Parse the request body for the note identifier
        note_identifier = event.get('noteIdentifier')
        
        # Retrieve the corresponding record from DynamoDB
        note_record = notes_table.get_item(Key={'noteIdentifier': note_identifier})
        document_name = note_record['Item'].get('documentName')
        
        # Remove the record from DynamoDB and the file from S3
        notes_table.delete_item(Key={'noteIdentifier': note_identifier})
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=document_name)
        
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
            'body': json.dumps({'result': 'Failed to delete note', 'error': str(error)})
        }
