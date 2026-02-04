import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cloudresume-test')

def lambda_handler(event, context):
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
        
