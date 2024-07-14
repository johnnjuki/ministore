"use server";

import { revalidatePath } from "next/cache";
import { Vonage } from "@vonage/server-sdk";
import { z } from "zod";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export async function verifyPhoneNumber(phoneNumber) {
  try {
    const request = await vonage.verify2.newRequest({
      brand: "BRAND_NAME",
      workflow: [
        {
          channel: Channels.SMS,
          to: phoneNumber,
        },
      ],
    });
    return request.requestId;
  } catch (error) {
    return "failed";
  }
}

export async function checkVerficationCode(requestId, code) {
  try {
    const status = await vonage.verify2.checkCode({
      requestId,
      code,
    });

    return status;
  } catch (error) {
    return "failed";
  }
}
