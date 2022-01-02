import AWS from 'aws-sdk';
import httpErrors from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import placeBidSchema from '../lib/schemas/placeBidSchema';
import { getAuctionById } from './getAuction';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  if (auction.status !== 'OPEN')
    throw new httpErrors.Forbidden('You cannot bid on closed auctions!');

  if (amount <= auction.highestBid.amount)
    throw new httpErrors.Forbidden(`You bid must be higher than ${auction.highestBid.amount}!`);

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (e) {
    console.log(e);
    throw new httpErrors.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({
    inputSchema: placeBidSchema,
    ajvOptions: { strict: false },
  })
);
