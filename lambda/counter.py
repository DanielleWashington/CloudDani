import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cloudresume-test')

def lambda_handler(event, context):
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }
    
    # Handle OPTIONS request (CORS preflight)
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Get current view count
        response = table.get_item(Key={'id': '1'})
        
        # Check if item exists
        if 'Item' not in response:
            # Initialize if doesn't exist
            views = 1
            table.put_item(Item={'id': '1', 'views': views})
            print(f"Initialized view count: {views}")
        else:
            # Increment view count - convert Decimal to int
            views = int(response['Item']['views'])
            views = views + 1
            table.put_item(Item={'id': '1', 'views': views})
            print(f"Updated view count: {views}")
        
        # Ensure views is an int (not Decimal) before JSON serialization
        views = int(views)
        
        # Return properly formatted response with CORS headers
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'count': views})
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e), 'count': 0})
        }
