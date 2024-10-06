package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.*;

@Service
public class EmailTemplateService {

    private static final Logger logger = LoggerFactory.getLogger(EmailTemplateService.class);
    private final SesV2Client sesV2Client;

    public EmailTemplateService(SesV2Client sesV2Client) {
        this.sesV2Client = sesV2Client;
    }

    public void send(String sender, String recipient, String templateName, Template myTemplate) throws Exception {
        Destination destination = Destination.builder()
                .toAddresses(recipient)
                .build();


        EmailContent emailContent = EmailContent.builder()
                .template(myTemplate)
                .build();

        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .destination(destination)
                .content(emailContent)
                .fromEmailAddress(sender)
                .build();


        try {
            logger.info("Attempting to send an email through Amazon SES...");
            SendEmailResponse response = sesV2Client.sendEmail(emailRequest);
            logger.info("Email sent! Message ID: {}", response.messageId());
        } catch (SesV2Exception e) {
            logger.error("Failed to send email: {}", e.awsErrorDetails().errorMessage());
            throw new Exception("Failed to send email: " + e.awsErrorDetails().errorMessage());
        }
    }

    public void createTemplate(String templateName, String subject, String textBody, String htmlBody) throws Exception {
        CreateEmailTemplateRequest templateRequest = CreateEmailTemplateRequest.builder()
                .templateContent(EmailTemplateContent.builder()
                        .subject(subject)
                        .text(textBody)
                        .html(htmlBody)
                        .build())
                .templateName(templateName)
                .build();

        try {
            logger.info("Attempting to create Email Template through Amazon SES...");
            CreateEmailTemplateResponse response = sesV2Client.createEmailTemplate(templateRequest);
            logger.info("Email Template Created! Message ID: {}", response.toString());
        } catch (SesV2Exception e) {
            logger.error("Failed to create template: {}", e.awsErrorDetails().errorMessage());
            throw new Exception("Failed to Create Template: " + e.awsErrorDetails().errorMessage());
        }
    }
}
