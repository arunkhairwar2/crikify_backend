class PinnacleSmsServices {
  accessKey = process.env.PINNACLE_ACCESS_KEY;
  apiUrl = process.env.PINNACLE_URL;
  senderId = process.env.PINNACLE_SENDER_ID;
  dltEntityId = process.env.PINNACLE_DLT_ENTITY_ID;
  dltTemplateId = process.env.PINNACLE_DLT_TEMPLATE_ID;

  async sendOtp(mobileNumber: string, otp: string) {
    if (
      !this.accessKey ||
      !this.apiUrl ||
      !this.senderId ||
      !this.dltEntityId ||
      !this.dltTemplateId
    ) {
      throw new Error("Missing OTP service credentials");
    }

    const message = `Your verification code is ${otp}. Use this OTP to complete your registration. BENCOS RESEARCH SOLUTIONS. `;
    const payload = {
      version: "1.0",
      accesskey: this.accessKey,
      messages: [
        {
          dest: [mobileNumber],
          msg: message,
          header: this.senderId,
          type: "PM",
          dlt_entity_id: this.dltEntityId,
          dlt_template_id: this.dltTemplateId,
        },
      ],
    };
    try {
      console.log(`[Pinnacle] Sending OTP to ${mobileNumber}...`);
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorData = await response.text();
        console.error("SMS API error response:", errorData);
        throw new Error(`SMS API call failed: ${response.statusText}`);
      }

      console.log(
        `[Pinnacle] OTP sent successfully to ${mobileNumber}. ReqID: ${data.req_id}`,
      );
      return data;
    } catch (error) {
      console.error("Failed to send OTP via Pinnacle SMS:", error);
      throw new Error("Failed to send OTP");
    }
  }
}

export default new PinnacleSmsServices();
