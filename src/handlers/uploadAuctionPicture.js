import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import cors from '@middy/http-cors';
import httpErrors from 'http-errors';

import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';
import pictureSchema from '../lib/schemas/uploadAuctionsPictureSchema';

export async function uploadAuctionPicture(event) {
    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;
    const auction = await getAuctionById(id);

    // Validate auction ownership
    if(auction.seller !== email)
        throw new httpErrors.Forbidden('You are not the seller of this auction!')

    const base64 = event.body.replace(/^data:image\/w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    let updatedAuction

    try {
        const pictureUrl = await uploadPictureToS3(id + '.jpg', buffer);
        updatedAuction = await setAuctionPictureUrl(id, pictureUrl);
    } catch (e) {
        console.error(e);
        throw new httpErrors.InternalServerError(e);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    }
}

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler())
    .use(validator({
        inputSchema: pictureSchema,
        ajvOptions: { strict: false },
    }))
    .use(cors());