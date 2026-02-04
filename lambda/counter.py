import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cloudresume-test')

def lambda_handler(event, context):
    # Get current view count
    response = table.get_item(Key={
        'id': '1'
    })
    
    views = response['Item']['views']
    views = views + 1
    print(f"Updated view count: {views}")
    
    # Update view count in DynamoDB
    table.put_item(Item={
        'id': '1',
        'views': views
    })
    
    # Return properly formatted response with CORS headers
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        },
        'body': json.dumps({
            'count': views
        })
    }
